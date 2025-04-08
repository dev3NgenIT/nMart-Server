import type { Request, Response, NextFunction, RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { Session } from '@/types/session'
import { appError, catchAsync } from '@/controllers/errorController'
import crypto from 'node:crypto'
import passport from 'passport'
import * as userDto from '@/dtos/userDtos'
import * as tokenService from '@/services/tokenService'
import User from '@/models/userModel'
import { promisify } from 'node:util'
import * as fileService from '@/services/fileService'
import * as otpService from '@/services/otpService'
import { sendMail } from '@/lib/utils'
import { client, OTP_SECRET, server } from '@/config'
import { UserDocument } from '@/types/user'
import { isEmail } from 'validator'


type CustomSession = {
  state: string
}

type CustomUser = Express.User & {
	_id: string
}
	


// router.get('/api/users' protect, ...)
export const protect:RequestHandler = catchAsync( async (req, res, next) => {
	const id = await tokenService.getUserIdFromAuthToken(req)

	const user = await User.findById(id)
	if(!user) return next(appError('No user Found, authentication failed', 401, 'AuthError'))

	req.session = { 
		...req.session, 
		// authToken,
		user: {
			role: user.role,
			id: user.id
		}
	}

	next()
})

// router.get('/api/users' protect, restrictTo('admin', 'leader'), getAllUsers)
export const restrictTo = (...roles: string[]) => (req:Request, _res:Response, next:NextFunction) => {
	const session = req.session as Session
	const user = session.user

	if(!user?.role) return next(appError('user.role not found', 404, 'AuthError'))

	const message = `Sorry you ( role: '${user?.role}' ) don't have permission to perform this action.`
	if(!roles.includes(user.role)) return next(appError(message, 403, 'PermissionDenied'))

	next()
}



// POST 	/api/auth/register
export const register: RequestHandler =  async (req, res, next) => {
	try {
		const email = req.body.email
		const phoneOrEmail = req.body.phone || email
		if(!OTP_SECRET) return next( appError(`otpSecret: ${OTP_SECRET} error`, 400, 'EnvError'))

		const userFound = await User.findOne({ email })
		if(userFound) return next(appError('This email already registerted'))

		if(req.body.coverPhoto) {
			const { error, image: coverPhoto } = await fileService.uploadFile(req.body.coverPhoto, '/users')
			if(error) return next(appError(`coverPhoto image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.coverPhoto = coverPhoto
		}
		if(req.body.avatar) {
			const { error, image: avatar } = await fileService.uploadFile(req.body.avatar, '/users')
			if(error) return next(appError(`avatar image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.avatar = avatar
		}

		// // send email to active account instead of success response
		// const otpPayload = await otpService.getOTPCode(phoneOrEmail, email)
		// if(!otpPayload) return next(appError('otpPayload empty'))


		const filteredBody = userDto.filterBodyForCreateUser(req.body)
		filteredBody.otpCode = phoneOrEmail

		const user = await User.create(filteredBody)
		if(!user) return next(appError('user insersation failed'))

		
		const responseData: ResponseData = {
			status: 'success',
			message: 'you successfully registerted!!!'
			// message: `an otp message is send to you via email to you`, 
			// data: {
			// 	phoneOrEmail,
			// 	hash: `${otpPayload.hashedOtp}.${otpPayload.expires}`, 	// send phone, expires + hashedOTP which will be require later
			// },

		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.coverPhoto?.secure_url) promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.avatar?.secure_url) promisify(fileService.removeFile)(req.body.avatar.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}


// POST 	/api/auth/verify-request
export const verifyRequest = catchAsync( async (req, res, next) => {
	const email = req.body.email
	const phoneOrEmail = req.body.phone || email

	const userId = req.session?.user.id
	// step-0: Make sure protected route: Only User himself can verify, not others

	// step-1: check user found
	let user = await User.findById(userId)
	if(!user) return next(appError('user not found'))
	if(user.isVerified) return next(appError('You are already varified user'))

	// step-2: get otp 
	const otpPayload = await otpService.getOTPCode(phoneOrEmail, email)
	if(!otpPayload) return next(appError('otpPayload empty'))

	
	// step-3: update user
	user.otpCode = phoneOrEmail
	await user.save({ validateBeforeSave: false })


	const responseData: ResponseData = {
		status: 'success',
		message: `an otp message is send to you via email to you`, 
		data: {
			phoneOrEmail,
			hash: `${otpPayload.hashedOtp}.${otpPayload.expires}`, 	// send phone, expires + hashedOTP which will be require later
		},
	}
	res.status(200).json( responseData )
})

// POST 	/api/auth/verify-user
export const verifyUser = catchAsync( async (req, res, next) => {
	if(!OTP_SECRET) return next( appError(`otpSecret: ${OTP_SECRET} error`, 400, 'EnvError'))

	const { phoneOrEmail, otp, hash } = req.body
	if(!phoneOrEmail || !otp || !hash) return next(appError('you must send: { phoneOrEmail, otp, hash: hashedOTP }'))

	const userId = req.session?.user.id
	if(!userId) return next(appError('You are not authenticated user'))

	// step-1: find user
	// let user = await User.findOne({ otpCode: phoneOrEmail})
	let user = await User.findById(userId)
	if(!user) return next(appError('please retry with your new otp'))

		console.log({ isVerified: user.isVerified })
	if(user.isVerified) return next(appError('You are already varified user'))


	// step-2: verify otp and hashed
	await	otpService.verifyOtpCode({ phoneOrEmail, otp, hashedOtp: hash })


	// step-3: update user
	user.isVerified = true
	user.otpCode = undefined
	await user.save({ validateBeforeSave: false })


	// step-4: Logout user
	await tokenService.removeTokenFromCookie(req)


	const responseData: ResponseData<UserDocument> = {
		status: 'success',
		message: 'user verification successfull !!!, please relogin again',
		// data: user,
	}
	res.status(200).json( responseData )
})



// POST 	/api/auth/login 	: Because POST not send cookie on { sameSite: 'lax' } 
export const login:RequestHandler = catchAsync( async (req, res, next) => {
	if(!req.body.email || !req.body.password) return next(appError('please pass email and password'))
	
	passport.authenticate('local', async (err: unknown, user: CustomUser) => {
		if(err) return next(err)
		if(!user) return next(appError('user not found'))


		await tokenService.sendTokenInCookie(req, user._id)

		const responseData: ResponseData = {
			status: 'success',
			message: 'login successfully!!!',
			// data: user,
			data: { 
				userId: user._id,
				authToken: req.session?.authToken 
			}
		}
		res.status(200).json( responseData )

	})(req, res, next)
})


// GET 	/api/auth/logout 	: Because POST not send cookie on { sameSite: 'lax' } 
export const logout:RequestHandler = catchAsync( async (req, res, next) => {

	await tokenService.removeTokenFromCookie(req)

	// req.session = null 												// destroy req.session  and auto delete cookie my cookieSession middleware
	const responseData: ResponseData = {
		status: 'success',
		data: 'logout success'
	}
	res.status(200).json( responseData )
})







// POST 	/api/auth/forgot-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const forgotPassword: RequestHandler = catchAsync( async (req, res, next) => {
	const { email } = req.body
	if(!email) return next(appError('email fields is mandatory'))
	if(!isEmail(email)) return next(appError(`invalid email: ${email}`))

	const user = await User.findOne({ email })
	if(!user) return next(appError(`you are not registerted user, please register first`))

	const resetToken = await user.getPasswordResetToken()

	try {
		await sendMail({
			to: email,
			subject: 'Password Reset Token | CodeCanyon',
			text: `resetToken: ${resetToken}`
		})
		if (process.env.NODE_ENV === 'development') console.log({ resetToken })

	} catch (error: unknown) {
		if(error instanceof Error) return next(appError(error.message, 401, 'ResetPasswordTokenError'))		

		if( typeof error === 'string')
		return next(appError(error, 400, 'ResetPasswordTokenError'))		
	}


	const responseData: ResponseData = {
		status: 'success',
		message: `token sent to ${email}`
	}
	res.status(200).json( responseData )
})

// PATCH 	/api/auth/reset-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const resetPassword: RequestHandler = catchAsync( async (req, res, next) => {
	const { resetToken, password, confirmPassword } = req.body
	if(!resetToken || !passport || !confirmPassword) return next(appError('must provide: resetToken, password, confirmPassword'))

	const digestToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	if(!digestToken) return next(appError('passwordResetToken validation failed, please try again'))

	const user = await User.findOne({ passwordResetToken: digestToken })
	if(!user) return next(appError('no user found, may be your resetToken not valid any more'))

	user.password = password
	user.confirmPassword = confirmPassword
	user.passwordResetToken = undefined
	user.updatedAt = new Date()
	const updatedUser = await user.save({ validateBeforeSave: true })

	updatedUser.password = ''

	// logout
	await tokenService.removeTokenFromCookie(req)

	const responseData: ResponseData = {
		status: 'success',
		data: 'password reset successfull, please re-login with new password',
	}
	res.status(200).json( responseData )
})

// PATCH 	/api/auth/update-password 	: Because POST not send cookie on { sameSite: 'lax' } 
export const updatePassword: RequestHandler = catchAsync( async (req, res, next) => {
	const missingFieldsError = 'you must provide currentPassword, password, confirmPassword fields'

  const { currentPassword, password, confirmPassword } = req.body
	if(!currentPassword || !password || !confirmPassword) return next(appError(missingFieldsError))
	if(currentPassword === password ) return next(appError(`please choose different password than currentPassword`))

	const userId = req.session?.user.id
	if(!userId) return next(appError('you must be authenticated user.'))

	const user = await User.findById(userId).select('+password')
	if(!user?.password) return next(appError('missing password from user document'))

	const isAuthenticated = await user.comparePassword(currentPassword)
	if(!isAuthenticated) return next(appError('your currentPassword is incorrect, did you forgot your password?'))

	user.password = password 
	user.confirmPassword = confirmPassword
	const updatedUser = await user.save({ validateBeforeSave: true })
	updatedUser.password = ''
	updatedUser.confirmPassword = ''

	// logout
	await tokenService.removeTokenFromCookie(req)
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'password update successfull, please re-login with new password',
	}
	res.status(200).json( responseData )
})


// GET 	/api/auth/google
export const googleLoginRequest: RequestHandler = (req, res, next) => {
  const state = crypto.randomUUID(); 							// Semi-clone required because next line type casting
  req.session = { ...req.session, state }
  // (req.session as CustomSession).state = state; 	// Store the state in the session

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state  																					// Include the state in the request to Google
  })(req, res, next)
}


// GET 	/api/auth/google/callback
export const googleCallbackHandler: RequestHandler = (req, res, next) => {
	
	 passport.authenticate('google', async (err: unknown, user: CustomUser ) => {
    if (err) return next(err) 
    if (!user) return res.redirect('/auth/login') 

    // Validate the state parameter to prevent CSRF attacks
    if (req.query.state !== (req.session as CustomSession).state) {
      return next(appError('invalid state parameter', 403, 'GoogleError'))
    }

		try {
			await tokenService.sendTokenInCookie(req, user._id)
			req.session = { ...req.session, state: req.query.state }

			const authToken = await tokenService.generateTokenForUser(user._id) 		
      // res.redirect(`/api/auth/google/success/?authToken=${authToken}`) 					// redirect to next 'googleSuccessHandler' middleware

			// const url = `${client.origin}/auth/validate/${authToken}`
			const url = `${req.protocol}://${req.get('host')}/auth/validate/${authToken}`
      res.redirect(url)


		} catch (err: unknown) {
    	if (err instanceof Error) return next(err.message) 
    	next(err) 
		}
  })(req, res, next)
}


// GET /auth/google/ 		=> /api/auth/google/success/?authToken={authToken} 
export const googleSuccessHandler: RequestHandler = catchAsync( async (req, res, next) => {
  const authToken = req.query.authToken as any
	if(!authToken) return next(appError('No authToken: authentication failed'))
	// console.log({ googleSuccessHandler: authToken })

	if(!req.session?.state) return next(appError('Do you try to hack?, this reques must come from google, no by you'))

	const { id } = await tokenService.verifyUserAuthToken(authToken) 
	await tokenService.sendTokenInCookie(req, id)

	const responseData: ResponseData = {
		status: 'success',
		message: 'login successfully!!!',
		data: { 
			userId: id,
			authToken
		}
	}
	res.status(200).json( responseData )

})






// GET  /auth/failure 		=>	/api/auth/failure 	(Proxy Reverse For API)
export const googleAuthFailure:RequestHandler = catchAsync( async (_req, _res, next) => {
	next(appError('google authentication failed', 401, 'GoogleAuthFailed'))
})





// GET 	/api/auth/facebook
export const facebookLoginRequest: RequestHandler = (req, res, next) => {
	
  const state = crypto.randomUUID(); 							// Semi-clone required because next line type casting
  req.session = { state }
  // (req.session as CustomSession).state = state; 	// Store the state in the session

  passport.authenticate('facebook', {
    scope: ['profile', 'email'],
    state  																					// Include the state in the request to Google
  })(req, res, next)
}

// GET 	/api/auth/facebook/callback
export const facebookCallbackHandler: RequestHandler = (req, res, next) => {
	
	 passport.authenticate('facebook', async (err: unknown, user: CustomUser ) => {
    if (err) return next(err) 
    if (!user) return res.redirect('/auth/login') 

    // Validate the state parameter to prevent CSRF attacks
    if (req.query.state !== (req.session as CustomSession).state) {
      return next(appError<'FacebookError'>('invalid state parameter', 403, 'FacebookError'))
    }


		try {
			await tokenService.sendTokenInCookie(req, user._id)

			const responseData: ResponseData = {
				status: 'success',
				message: 'login successfully!!!',
				// data: user,
			}
			res.status(200).json( responseData )

		} catch (err: unknown) {
    	if (err instanceof Error) return next(err.message) 
    	next(err) 
		}
  })(req, res, next)
}




// POST 	/api/auth/update-email
export const sendUpdateEmailRequest: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'google googleAuthFailure '
	}
	res.status(200).json( responseData )
}



// GET 	/api/auth/update-email/:resetToken
export const updateEmail: RequestHandler = (req, res, next) => {
	
	const responseData: ResponseData = {
		status: 'success',
		data: 'google googleAuthFailure '
	}
	res.status(200).json( responseData )
}





