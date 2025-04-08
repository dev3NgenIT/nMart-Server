import type { CreateFaqQuestion, FaqQuestionDocument, UpdateFaqQuestion } from '@/types/faqQuestion'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'user',
	'name',
	'email',
	'message',
]


// POST 	/api/faq-questions
export const filterBodyForCreateFaqQuestion = (body: CreateFaqQuestion) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// faq => faq._doc
export const filterFaqQuestionDocument = (body: FaqQuestionDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/faq-questions/:faqQuestionId
export const filterBodyForUpdateFaqQuestion = (body: UpdateFaqQuestion) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


