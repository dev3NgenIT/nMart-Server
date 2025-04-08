import 'dotenv/config'
import crypto from 'crypto'
import { appError } from '@/controllers/errorController'
import { OTP_SECRET } from '@/config'
import { sendMail } from '@/lib/nodemailer'

export const generateOTP = async () => {
	return crypto.randomInt(1000, 9999)
}


export const hashOTP = async (data: string, otpSecret: string) => {
	return crypto.createHmac('sha256', otpSecret).update(data).digest('base64')
}


type	OTPCodeResponse = { 
	hashedOtp: string
	expires: number 
}

type VerifyOtpCode = {
 	phoneOrEmail: string, 
	otp: string, 
	hashedOtp: string 
}

export const getOTPCode = async (phoneOrEmail: string, email: string): Promise<OTPCodeResponse | void> => {
	if(!OTP_SECRET) throw appError(`otpSecret: ${OTP_SECRET} error`, 400, 'EnvError')

	// Step-1: 
	const otp = await generateOTP()


	/* Step-2: To send user otp and hashedOtp too, so that no need to store 
						into database, and later get hashedOtp back from client to validate */
	// const ttl = 1000 * 60 * 50 						// => TTL = Time To Live
	const ttl = 1000 * 60 * 5000 						// => TTL = Time To Live
	const expires = Date.now() + ttl
	const data = `${phoneOrEmail}.${otp}.${expires}`
	const hashedOtp = await hashOTP(data, OTP_SECRET)


	// Step-3: 
	try {
		// const data = await otpService.sendSMS(phone, otp) 				// get twilio details first
		// if(data.error) return next( appError(data.msg, data.error, 'OTP_ERROR') )
		// // console.log(data)

		await sendMail({
			from: 'dev6.ngenit@gmail.com',
			to: email,
			subject: 'Testing | sending otp for active user',
			text: `otp: ${otp}`
		})

		if (process.env.NODE_ENV === 'development') console.log({ otp })

	return { hashedOtp, expires }

	} catch (error: unknown) {
		if(error instanceof Error) throw appError(error.message, 401, 'OTP_error')		

		if( typeof error === 'string')
		throw appError(error, 400, 'OTP_error')		
	}
}

export const validateOTP = async (data: string, hash: string, otpSecret: string) => {
	const currentHash = crypto.createHmac('sha256', otpSecret).update(data).digest('base64')
	return currentHash === hash
}


export const verifyOtpCode = async ({ phoneOrEmail, otp, hashedOtp }: VerifyOtpCode): Promise<void> => {
	if(!OTP_SECRET) throw appError(`otpSecret: ${OTP_SECRET} error`, 400, 'EnvError')
	
	// step-1: check expires
	const [ hashedOTP, expires ] = hashedOtp.split('.')

	const isValidHashed = Number(expires) > Date.now()
	if(!isValidHashed) throw appError('your OTP expires, please collect new OTP', 401, 'TokenError')

	// step-2: check hashed hash
	const data = `${phoneOrEmail}.${otp}.${expires}` 			// get the same pattern from send otp
	const isValid = await validateOTP(data, hashedOTP, OTP_SECRET)
	if(!isValid) throw appError('hashed otp violated')
}


