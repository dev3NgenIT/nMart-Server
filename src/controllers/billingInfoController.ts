import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { BillingInfoDocument } from '@/types/billingInfo'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import BillingInfo from '@/models/billingInfoModel'


// GET /api/billing-info
export const getBillingInfos: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total, } = await apiFeatures(BillingInfo, req.query, filter)
	const shippingInfos = await query

	const responseData: ResponseData<BillingInfoDocument[]> = {
		status: 'success',
		count: shippingInfos.length,
		total,
		data: shippingInfos,
	}
	res.status(200).json( responseData )
})


// POST 	/api/billing-info
export const addBillingInfo: RequestHandler =  catchAsync(async (req, res, next) => {

	const billingInfo = await BillingInfo.create(req.body)
	if(!billingInfo) return next(appError('billingInfo not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: billingInfo,
	}
	res.status(201).json( responseData )
})


// GET /api/billing-info/:billingInfoId
export const getBillingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const billingInfoId = req.params.billingInfoId

	const billingInfo = await BillingInfo.findById(billingInfoId)
	if(!billingInfo) return next(appError('billingInfo update failed'))


	const responseData: ResponseData<BillingInfoDocument> = {
		status: 'success',
		data: billingInfo
	}

	res.status(200).json( responseData )
})

// PATCH /api/billing-info/:billingInfoId
export const updateBillingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const billingInfoId = req.params.billingInfoId

	const billingInfo = await BillingInfo.findByIdAndUpdate(billingInfoId, req.body, { new: true })
	if(!billingInfo) return next(appError('billingInfo update failed'))


	const responseData: ResponseData<BillingInfoDocument> = {
		status: 'success',
		data: billingInfo
	}

	res.status(200).json( responseData )
})


// DELETE /api/billing-info/:billingInfoId
export const deleteBillingInfoById:RequestHandler = catchAsync(async (req, res, next) => {
	const billingInfoId = req.params.billingInfoId

	const billingInfo = await BillingInfo.findByIdAndDelete(billingInfoId)
	if(!billingInfo) return next(appError('billingInfo not found'))

	const responseData: ResponseData<BillingInfoDocument> = {
		status: 'success',
		data: billingInfo
	}
	res.status(200).json( responseData )
})