import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { ShippingInfoDocument } from '@/types/shippingInfo'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import ShippingInfo from '@/models/shippingInfoModel'


// GET /api/shipping-info
export const getShippingInfos: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(ShippingInfo, req.query, filter)
	const shippingInfos = await query
	
	const responseData: ResponseData<ShippingInfoDocument[]> = {
		status: 'success',
		count: shippingInfos.length,
		total,
		data: shippingInfos,
	}
	res.status(200).json( responseData )
})


// POST 	/api/shipping-info
export const addShippingInfo: RequestHandler =  catchAsync(async (req, res, next) => {

	const shippingInfo = await ShippingInfo.create(req.body)
	if(!shippingInfo) return next(appError('shippingInfo not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: shippingInfo,
	}
	res.status(201).json( responseData )
})


// GET /api/shipping-info/:shippingInfoId
export const getShippingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const shippingInfoId = req.params.shippingInfoId

	const shippingInfo = await ShippingInfo.findById(shippingInfoId)
	if(!shippingInfo) return next(appError('shippingInfo update failed'))


	const responseData: ResponseData<ShippingInfoDocument> = {
		status: 'success',
		data: shippingInfo
	}

	res.status(200).json( responseData )
})

// PATCH /api/shipping-info/:shippingInfoId
export const updateShippingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const shippingInfoId = req.params.shippingInfoId

	const shippingInfo = await ShippingInfo.findByIdAndUpdate(shippingInfoId, req.body, { new: true })
	if(!shippingInfo) return next(appError('shippingInfo update failed'))


	const responseData: ResponseData<ShippingInfoDocument> = {
		status: 'success',
		data: shippingInfo
	}

	res.status(200).json( responseData )
})


// DELETE /api/shipping-info/:shippingInfoId
export const deleteShippingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const shippingInfoId = req.params.shippingInfoId

	const shippingInfo = await ShippingInfo.findByIdAndDelete(shippingInfoId)
	if(!shippingInfo) return next(appError('shippingInfo not found'))

	const responseData: ResponseData<ShippingInfoDocument> = {
		status: 'success',
		data: shippingInfo
	}
	res.status(200).json( responseData )
})