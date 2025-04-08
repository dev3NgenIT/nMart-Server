import type { CreateSubCategory, SubCategoryDocument, UpdateSubCategory } from '@/types/subCategory'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'name',
	'slug',
	'description', 		
	'isVisible',
	'icon',
	'thumbnail',
	'banner',
]



// POST 	/api/sub-categories
export const filterBodyForCreateSubCategory = (body: CreateSubCategory) => {
	const allowedFields = [
		...commonAllowedFields,
		'category',
		'user',
	]

	return filterObjectByArray(body, allowedFields)
}

// subCategory => subCategory._doc
export const filterSubCategoryDocument = (body: SubCategoryDocument) => {
	const allowedFields = [
		...commonAllowedFields,
		'category',
		'user',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/sub-categories/:subCategoryId
export const filterBodyForUpdateSubCategory = (body: UpdateSubCategory) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}



