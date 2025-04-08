import type { CreateOffer, OfferDocument, UpdateOffer } from '@/types/offer'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'name',
	'slug',
	'isSelecte',
	'buttonName',
	'headerSlogan',

	'startDate',
	'endDate',

	'image',
	'thumbnail',
	'banner',
	'footerBanner',
]


// POST 	/api/offers
export const filterBodyForCreateOffer = (body: CreateOffer) => {
	const allowedFields = [
		...commonAllowedFields,
		'product',
	]

	return filterObjectByArray(body, allowedFields)
}

// brand => brand._doc
export const filterBrandDocument = (body: OfferDocument) => {
	const allowedFields = [
		...commonAllowedFields,
		'product',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/offers/:offerId
export const filterBodyForUpdateOffer = (body: UpdateOffer) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


