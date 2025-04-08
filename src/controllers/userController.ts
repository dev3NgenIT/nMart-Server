import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { UserDocument } from '@/types/user'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import User from '@/models/userModel'
import * as fileService from '@/services/fileService'
import * as tokenService from '@/services/tokenService'
import * as userDtos from '@/dtos/userDtos'
import { Roles } from '@/types/constants'

export const getAllUsers: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(User, req.query, filter)
	const users = await query
	
	const responseData: ResponseData<UserDocument[]> = {
		status: 'success',
		count: users.length,
		total,
		data: users,
	}
	res.status(200).json( responseData )
})


// GET /api/users/:userId
export const getUserById:RequestHandler = catchAsync(async (req, res, next) => {
	const userId = req.params.userId
	const filter = { _id: userId }

	const { query, total } = await apiFeatures(User, req.query, filter)
	const users = await query.limit(1)
	if(!users.length) return next(appError('user not found'))

	// const user = await User.findOne(filter)
	// if(!user) return next(appError('user not found'))

	const responseData: ResponseData<UserDocument> = {
		status: 'success',
		data: users[0]
		// data: user
	}
	res.status(200).json( responseData )
})


// GET /api/users/me 		: router.get('/me', authController.protect, userController.addUserId, userController.getUserById)
export const addUserId:RequestHandler = catchAsync(async (req, res, next) => {
	req.params.userId = req.session?.userId || await tokenService.getUserIdFromAuthToken(req)

	next()
})



// PATCH /api/users/:userId
export const updateUserById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const userId = req.params.userId

		const user = await User.findById(userId)
		if(!user) return next(appError(`user not found by userId=${userId}`))


		// const isAdmin = req.session?.user?.role === Roles.ADMIN
		// if(!isAdmin) delete req.body.role

		// const isSelf = req.session?.user === user.id 
		// const isAdmin = req.session?.user.role === Roles.ADMIN

		// if(!isAdmin) req.body.role = undefined

		// if(!isAdmin) {
		// 	if(!isSelf) return next(appError('only user-himself or admin user can update others user'))
		// }
		



		if(req.body.avatar) {
			const { error, image: avatar } = await fileService.uploadFile(req.body.avatar, '/users')
			if(error) return next(appError(`avatar image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.avatar = avatar
		}

		const filteredBody = userDtos.filterBodyForUpdate(req.body)
		const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, { new: true })
		if(!updatedUser) return next(appError('user update failed'))

		if(req.body.avatar) {
			req.body.avatar = user.avatar 	// add existing avatar, so that it can be deleted later

			// delete old avatar if have
			setTimeout(() => {
				if(user.avatar?.secure_url) promisify(fileService.removeFile)(user.avatar.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<UserDocument> = {
			status: 'success',
			data: updatedUser
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.avatar?.secure_url) promisify(fileService.removeFile)(req.body.avatar.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/users/:userId
export const deleteUserById:RequestHandler = catchAsync(async (req, res, next) => {
	const userId = req.params.userId

	const user = await User.findByIdAndDelete(userId)
	if(!user) return next(appError('user not found'))

	const isAdmin = req.session?.user.role === Roles.ADMIN
	if(!isAdmin) return next(appError('only admin user can delete others user'))
	

	// delete existing avatar if have
	setTimeout(() => {
		if(user.avatar?.secure_url) promisify(fileService.removeFile)(user.avatar.secure_url)
	}, 1000)

	// logout user
	await tokenService.removeTokenFromCookie(req)

	const responseData: ResponseData<UserDocument> = {
		status: 'success',
		data: user
	}
	res.status(200).json( responseData )
})




// POST 	/api/users
export const createUserByAdminUser: RequestHandler = catchAsync( async (req, res, next) => {
	const userFound = await User.findOne({ email: req.body.email })
	if(userFound) return next(appError('This email already registerted'))

	const filteredBody = userDtos.filterBodyForCreateUserByAdmin(req.body)

	const user = await User.create(filteredBody)
	if(!user) return next(appError('user insersation failed'))

	const responseData: ResponseData = {
		status: 'success',
		message: 'you successfully registerted!!!',
		data: user
	}
	res.status(201).json( responseData )
})




// => POST /api/users/bulk-delete
export const bulkDeleteUsers:RequestHandler = catchAsync( async (req, res, next) => {
	const userIds = req.body.userIds || []

	const users = await User.deleteMany({ _id: { $in: userIds } });
	if(users.deletedCount === 0 ) return next(appError('brand deletation failed'))

	const responseData: ResponseData = {
		status: 'success',
		message: `deleted ${users.deletedCount} users`
	}
	res.status(200).json( responseData )
})
