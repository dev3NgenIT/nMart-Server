import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import FaqCategory from '@/models/faqCategoryModel'
import { FaqCategoryDocument } from '@/types/faqCategory'


// GET /api/faq-categories
export const getFaqCategories: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(FaqCategory, req.query, filter)
	const faqCategories = await query
	
	const responseData: ResponseData<FaqCategoryDocument[]> = {
		status: 'success',
		count: faqCategories.length,
		total,
		data: faqCategories,
	}
	res.status(200).json( responseData )
})


// POST 	/api/faq-categories
export const addFaqCategory: RequestHandler =  catchAsync(async (req, res, next) => {

	const faqCagegory = await FaqCategory.create(req.body)
	if(!faqCagegory) return next(appError('faqCagegory not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: faqCagegory,
	}
	res.status(201).json( responseData )
})

// GET /api/faq-categories/:faqCategoryId
export const getFaqCagegoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId

	const faqCagegory = await FaqCategory.findById(faqCategoryId)
	if(!faqCagegory) return next(appError('faqCagegory not found'))
	
	const responseData: ResponseData<FaqCategoryDocument> = {
		status: 'success',
		data: faqCagegory
	}
	res.status(200).json( responseData )
})


// PATCH /api/faq-categories/:faqCategoryId
export const updateFaqCagegoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId

	const faqCagegory = await FaqCategory.findByIdAndUpdate(faqCategoryId, req.body, { new: true })
	if(!faqCagegory) return next(appError('faqCagegory update failed'))


	const responseData: ResponseData<FaqCategoryDocument> = {
		status: 'success',
		data: faqCagegory
	}

	res.status(200).json( responseData )
})


// DELETE /api/faq-categories/:faqCategoryId
export const deleteFaqCagegoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqCategoryId = req.params.faqCategoryId

	const faqCagegory = await FaqCategory.findByIdAndDelete(faqCategoryId)
	if(!faqCagegory) return next(appError('faqCagegory not found'))

	const responseData: ResponseData<FaqCategoryDocument> = {
		status: 'success',
		data: faqCagegory
	}
	res.status(200).json( responseData )
})