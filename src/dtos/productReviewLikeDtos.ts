import type { CreateProductReviewLike, ProductReviewLikeDocument, UpdateProductReviewLike } from '@/types/productReviewLikes'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'review',
	'user',
	'product',
]


// POST 	/api/product-review-likes
export const filterBodyForCreateProductReviewLike = (body: CreateProductReviewLike) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// productReviewLike => productReviewLike._doc
export const filterProductReviewLikeDocument = (body: ProductReviewLikeDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/product-review-likes/:productReviewLikeId
export const filterBodyForUpdateProductReviewLike = (body: UpdateProductReviewLike) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


