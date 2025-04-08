import type { CreateWishList, UpdateWishList, WishListDocument } from '@/types/withlist'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'product',
	'user',
]


// POST 	/api/withlists
export const filterBodyForCreateWishList = (body: CreateWishList) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// wishList => wishList._doc
export const filterWishListDocument = (body: WishListDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/wishlists/:wishListId
export const filterBodyForUpdateWishList = (body: UpdateWishList) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


