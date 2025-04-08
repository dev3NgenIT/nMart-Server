import type { ChildCategoryDocument, CreateChildCategory, UpdateChildCategory } from '@/types/childCategory'
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


// POST 	/api/child-sub-categories
export const filterBodyForCreateChildCategory = (body: CreateChildCategory) => {
	const allowedFields = [
		...commonAllowedFields,
		'subCategory',
		'user',
	]

	return filterObjectByArray(body, allowedFields)
}

// childSubCategory => childSubCategory._doc
export const filterChildCategoryDocument = (body: ChildCategoryDocument) => {
	const allowedFields = [
		...commonAllowedFields,
		'subCategory',
		'user',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/child-categories/:childSubCategoryId
export const filterBodyForUpdateChildCategory = (body: UpdateChildCategory) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}



