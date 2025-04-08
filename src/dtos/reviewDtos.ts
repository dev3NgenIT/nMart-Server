import type { CreateReview, ReviewDocument, UpdateReview } from '@/types/review'
import { filterObjectByArray } from '@/lib/utils'


const commonAllowedFields = [
	'review',
	'images',
	'rating',
	'like',
]

// POST 	/api/reviews
export const filterBodyForCreateReview = (body: CreateReview) => {
	const allowedFields = [
		'user',
		'product',
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// review => review._doc
export const filterReviewDocument = (body: ReviewDocument) => {
	const allowedFields = [
		'user',
		'product',
		// 'likes',
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/reviews/:reviewId
export const filterBodyForUpdateReview = (body: UpdateReview) => {
	const allowedFields = [
		...commonAllowedFields,
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}



