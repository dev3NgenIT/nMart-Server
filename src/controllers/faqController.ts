import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { FaqDocument } from '@/types/faq'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import * as faqDtos from '@/dtos/faqDtos'
import Faq from '@/models/faqModel'


// GET /api/faqs
export const getFaqs: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Faq, req.query, filter)
	const faqs = await query
	
	const responseData: ResponseData<FaqDocument[]> = {
		status: 'success',
		count: faqs.length,
		total,
		data: faqs,
	}
	res.status(200).json( responseData )
})


// POST 	/api/faqs
export const addFaq: RequestHandler =  catchAsync(async (req, res, next) => {

	const filteredBody = faqDtos.filterBodyForCreateFaq(req.body)
	const faq = await Faq.create(filteredBody)
	if(!faq) return next(appError('faq not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: faq,
	}
	res.status(201).json( responseData )
})

// GET /api/faqs/:faqId
export const getFaqById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqId = req.params.faqId

	const faq = await Faq.findById(faqId)
	if(!faq) return next(appError('faq not found'))
	
	const responseData: ResponseData<FaqDocument> = {
		status: 'success',
		data: faq
	}
	res.status(200).json( responseData )
})


// PATCH /api/faqs/:faqId
export const updateFaqById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqId = req.params.faqId

	const filteredBody = faqDtos.filterBodyForUpdateFaq(req.body)
	const faq = await Faq.findByIdAndUpdate(faqId, filteredBody, { new: true })
	if(!faq) return next(appError('faq update failed'))


	const responseData: ResponseData<FaqDocument> = {
		status: 'success',
		data: faq
	}

	res.status(200).json( responseData )
})


// DELETE /api/faqs/:faqId
export const deleteFaqById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqId = req.params.faqId

	const faq = await Faq.findByIdAndDelete(faqId)
	if(!faq) return next(appError('faq not found'))

	const responseData: ResponseData<FaqDocument> = {
		status: 'success',
		data: faq
	}
	res.status(200).json( responseData )
})