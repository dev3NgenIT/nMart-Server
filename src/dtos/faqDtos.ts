import type { CreateFaq, FaqDocument, UpdateFaq } from '@/types/faq'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'category',
	'question',
	'answer',
	'listOrder',

	'isVisible',
]


// POST 	/api/faqs
export const filterBodyForCreateFaq = (body: CreateFaq) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// faq => faq._doc
export const filterFaqDocument = (body: FaqDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/faqs/:faqId
export const filterBodyForUpdateFaq = (body: UpdateFaq) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


