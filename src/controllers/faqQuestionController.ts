import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { FaqQuestionDocument } from '@/types/faqQuestion'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import * as faqQuestionDtos from '@/dtos/faqQuestionDtos'
import FaqQuesion from '@/models/faqQuestionModel'


// GET /api/faq-questions
export const getFaqQuestions: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(FaqQuesion, req.query, filter)
	const faqQuestions = await query
	
	const responseData: ResponseData<FaqQuestionDocument[]> = {
		status: 'success',
		count: faqQuestions.length,
		total,
		data: faqQuestions,
	}
	res.status(200).json( responseData )
})


// POST 	/api/faq-questions
export const addFaqQuestion: RequestHandler =  catchAsync(async (req, res, next) => {

	const filteredBody = faqQuestionDtos.filterBodyForCreateFaqQuestion(req.body)
	const faqQuestion = await FaqQuesion.create(filteredBody)
	if(!faqQuestion) return next(appError('faqQuestion not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: faqQuestion,
	}
	res.status(201).json( responseData )
})

// GET /api/faq-questions/:faqQuestionId
export const getFaqQuestionById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqQuestionId = req.params.faqQuestionId

	const faqQuestion = await FaqQuesion.findById(faqQuestionId)
	if(!faqQuestion) return next(appError('faqQuestion not found'))
	
	const responseData: ResponseData<FaqQuestionDocument> = {
		status: 'success',
		data: faqQuestion
	}
	res.status(200).json( responseData )
})


// PATCH /api/faq-questions/:faqQuestionId
export const updateFaqQuestionById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqQuestionId = req.params.faqQuestionId

	const filteredBody = faqQuestionDtos.filterBodyForUpdateFaqQuestion(req.body)
	const faqQuestion = await FaqQuesion.findByIdAndUpdate(faqQuestionId, filteredBody, { new: true })
	if(!faqQuestion) return next(appError('faqQuestion update failed'))


	const responseData: ResponseData<FaqQuestionDocument> = {
		status: 'success',
		data: faqQuestion
	}

	res.status(200).json( responseData )
})


// DELETE /api/faq-questions/:faqQuestionId
export const deleteFaqQuestionById:RequestHandler = catchAsync(async (req, res, next) => {
	const faqQuestionId = req.params.faqQuestionId

	const faqQuestion = await FaqQuesion.findByIdAndDelete(faqQuestionId)
	if(!faqQuestion) return next(appError('faqQuestion not found'))

	const responseData: ResponseData<FaqQuestionDocument> = {
		status: 'success',
		data: faqQuestion
	}
	res.status(200).json( responseData )
})