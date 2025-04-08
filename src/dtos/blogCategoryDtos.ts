import type { BlogCategoryDocument, CreateBlogCategory, UpdateBlogCategory } from '@/types/blogCategory'
import { filterObjectByArray } from '@/lib/utils'



const commonAllowedFields = [
	'name',
	'slug',
	'title', 		
	'description', 		
	'isVisible',
	'image',
]


// POST 	/api/blog-categories
export const filterBodyForCreateBlogCategory = (body: CreateBlogCategory) => {
	const allowedFields = [
		...commonAllowedFields,
		'user',
	]

	return filterObjectByArray(body, allowedFields)
}

// blogCategory => blogCategory._doc
export const filterCategoryDocument = (body: BlogCategoryDocument) => {
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


// PATCH 	/api/blog-categories/:blogCategoryId
export const filterBodyForUpdateBlogCategory = (body: UpdateBlogCategory) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


