import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { SubscribeDocument } from '@/types/subscribe'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures, sendMail } from '@/lib/utils'
import * as subscribeDtos from '@/dtos/subscribeDtos'
import Subscribe from '@/models/subscribeModel'


// GET /api/subscribes
export const getSubscribes: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Subscribe, req.query, filter)
	const subscribes = await query
	
	const responseData: ResponseData<SubscribeDocument[]> = {
		status: 'success',
		count: subscribes.length,
		total,
		data: subscribes,
	}
	res.status(200).json( responseData )
})


// POST 	/api/subscribes
export const addSubscribe: RequestHandler =  catchAsync(async (req, res, next) => {
	const email = req.body.email
	if(!email) return next(appError('email field missing'))

	const filteredBody = subscribeDtos.filterBodyForCreateSubscribe(req.body)
	const subscribe = await Subscribe.create(filteredBody)
	if(!subscribe) return next(appError('subscribe not found'))

	try {
		await sendMail({
			to: email,
			subject: 'Subscribe Eamil | CodeCanyon',
			text: `your email is: ${email}`
		})

	} catch (error: unknown) {
		if(error instanceof Error) return next(appError(error.message, 401, 'error'))		

		if( typeof error === 'string')
		return next(appError(error, 400, 'error'))		
	}

	const responseData: ResponseData = {
		status: 'success',
		data: subscribe,
	}
	res.status(201).json( responseData )
})

// GET /api/subscribes/:subscribeId
export const getSubscribeById:RequestHandler = catchAsync(async (req, res, next) => {
	const subscribeId = req.params.subscribeId

	const subscribe = await Subscribe.findById(subscribeId)
	if(!subscribe) return next(appError('subscribe not found'))
	
	const responseData: ResponseData<SubscribeDocument> = {
		status: 'success',
		data: subscribe
	}
	res.status(200).json( responseData )
})


// PATCH /api/subscribes/:subscribeId
export const updateSubscribeById:RequestHandler = catchAsync(async (req, res, next) => {
	const subscribeId = req.params.subscribeId

	const filteredBody = subscribeDtos.filterBodyForUpdateSubscribe(req.body)
	const subscribe = await Subscribe.findByIdAndUpdate(subscribeId, filteredBody, { new: true })
	if(!subscribe) return next(appError('subscribe update failed'))


	const responseData: ResponseData<SubscribeDocument> = {
		status: 'success',
		data: subscribe
	}

	res.status(200).json( responseData )
})


// DELETE /api/subscribes/:subscribeId
export const deleteSubscribeById:RequestHandler = catchAsync(async (req, res, next) => {
	const subscribeId = req.params.subscribeId

	const subscribe = await Subscribe.findByIdAndDelete(subscribeId)
	if(!subscribe) return next(appError('subscribe not found'))

	const responseData: ResponseData<SubscribeDocument> = {
		status: 'success',
		data: subscribe
	}
	res.status(200).json( responseData )
})