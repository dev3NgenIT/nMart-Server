import type { BrandDocument, CreateBrand, UpdateBrand } from '@/types/brand'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'name',
	'slug',
	'description',
	'isVisible',

	'image',
	'logo',
	'thumbnail',
	'banner',
]


// POST 	/api/categories
export const filterBodyForCreateBrand = (body: CreateBrand) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// brand => brand._doc
export const filterBrandDocument = (body: BrandDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/brands/:brandId
export const filterBodyForUpdateBrand = (body: UpdateBrand) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


