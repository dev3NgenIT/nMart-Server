import type { BlogDocument, CreateBlog, UpdateBlog } from '@/types/blog'
import { filterObjectByArray } from '@/lib/utils'



const commonFields = [
	'name',
	'slug',
	'summary',
	'content',

	'isVisible',
  'additionalUrl',
	'banner',
	'tags',
]

// POST 	/api/blogs
export const filterBodyForCreateBlog = (body: CreateBlog) => {
	const allowedFields = [
		...commonFields,

		'category',
		'author',
	]

	return filterObjectByArray(body, allowedFields)
}

// brand => brand._doc
export const filterBlogDocument = (body: BlogDocument) => {
	const allowedFields = [
		...commonFields,

		'category',
		'author',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/blogs/:blogId
export const filterBodyForUpdateBlog = (body: UpdateBlog) => {

	const allowedFields = [
		...commonFields
	]
	return filterObjectByArray(body, allowedFields)
}


