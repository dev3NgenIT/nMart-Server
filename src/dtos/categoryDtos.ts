import type { CategoryDocument, CreateCategory, UpdateCategory } from '@/types/category'
import { filterObjectByArray } from '@/lib/utils'



const commonAllowedFields = [
	'name',
	'slug',
	'description', 		
	'isVisible',
	'icon',
	'thumbnail',
	'banner',
	'isCategoryShownOnFrontend',
]


// POST 	/api/categories
export const filterBodyForCreateCategory = (body: CreateCategory) => {
	const allowedFields = [
		...commonAllowedFields,
		'user',
		'slug',
	]

	return filterObjectByArray(body, allowedFields)
}

// category => category._doc
export const filterCategoryDocument = (body: CategoryDocument) => {
	const allowedFields = [
		...commonAllowedFields,
		'user',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/categories/:categoryId
export const filterBodyForUpdateCategory = (body: UpdateCategory) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


