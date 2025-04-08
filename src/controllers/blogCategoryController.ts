import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { BlogCategoryDocument } from '@/types/blogCategory'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import BlogCategory from '@/models/blogCategoryModel'
import * as fileService from '@/services/fileService'
import * as blogCategoryDtos from '@/dtos/blogCategoryDtos'
import { isValidObjectId } from 'mongoose'


// GET /api/blog-categories
export const getBlogCagegories: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(BlogCategory, req.query, filter)
	const blogCategories = await query
	
	const responseData: ResponseData<BlogCategoryDocument[]> = {
		status: 'success',
		count: blogCategories.length,
		total,
		data: blogCategories,
	}
	res.status(200).json( responseData )
})


// POST 	/api/blog-categories
export const addBlogCategory: RequestHandler =  async (req, res, next) => {
	try {
		if(req.body.image) {
			const { error, image: image } = await fileService.uploadFile(req.body.image, '/blogCategories')
			if(error) return next(appError(`blogCategory logo upload error: ${error}`))

			req.body.image = image
		}

		const filteredBody = blogCategoryDtos.filterBodyForCreateBlogCategory(req.body)
		const blogCategory = await BlogCategory.create(filteredBody)
		if(!blogCategory) return next(appError('blogCategory not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: blogCategory,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.image?.secure_url) promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/blog-categories/:blogCategoryId
export const getBlogCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const blogCategoryId = req.params.blogCategoryId
	const filter = (isValidObjectId(blogCategoryId)) ?  { _id: blogCategoryId } : { slug: blogCategoryId }

	// const blogCategories = await apiFeatures(blogCategory, req.query, filter).limit(1)
	// if(!blogCategories.length) return next(appError('blogCategories not found'))

	const blogCategory = await BlogCategory.findOne(filter)
	if(!blogCategory) return next(appError('blogCategory not found'))
	
	const responseData: ResponseData<BlogCategoryDocument> = {
		status: 'success',
		data: blogCategory
	}
	res.status(200).json( responseData )
})


// PATCH /api/blog-categories/:blogCategoryId
export const updateBlogCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const blogCategoryId = req.params.blogCategoryId
		const filter = (isValidObjectId(blogCategoryId)) ?  { _id: blogCategoryId } : { slug: blogCategoryId }

		const blogCategory = await BlogCategory.findOne(filter)
		if(!blogCategory) return next(appError('blogCategory not found'))

		if(req.body.image) {
			const { error, image } = await fileService.uploadFile(req.body.image, '/blogCategories')
			if(error) return next(appError(`blogCategory image upload error: ${error}`))

			req.body.image = image
		}

		const filteredBody = blogCategoryDtos.filterBodyForUpdateBlogCategory(req.body)
		const updatedCategory = await BlogCategory.findByIdAndUpdate(blogCategoryId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('blogCategory update failed'))

		if(req.body.image) {
			req.body.image = blogCategory.image 	
			
			setTimeout(() => {
				if(blogCategory.image?.secure_url) promisify(fileService.removeFile)(blogCategory.image.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<BlogCategoryDocument> = {
			status: 'success',
			data: updatedCategory
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.image?.secure_url) promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/blog-categories/:blogCategoryId
export const deleteBlogCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const blogCategoryId = req.params.blogCategoryId
	const filter = (isValidObjectId(blogCategoryId)) ?  { _id: blogCategoryId } : { slug: blogCategoryId }

	const blogCategory = await BlogCategory.findOneAndDelete(filter)
	if(!blogCategory) return next(appError('blogCategory not found'))

	// delete existing image if have
	setTimeout(() => {
		if(blogCategory.image?.secure_url) promisify(fileService.removeFile)(blogCategory.image.secure_url)
	}, 1000)


	const responseData: ResponseData<BlogCategoryDocument> = {
		status: 'success',
		data: blogCategory
	}
	res.status(200).json( responseData )
})



// => DELETE /api/blog-categories/many
export const deletelBlogCategoriesByIds:RequestHandler = catchAsync( async (req, res, next) => {

	const categoryIds = req.body.categoryIds || []
	const blogCategories = await BlogCategory.find({_id: { $in: categoryIds }})
	if(!blogCategories.length) return next(appError('no blogCategories found'))

	const deletedCategories = await BlogCategory.deleteMany({_id: { $in: categoryIds }})
	if(deletedCategories.deletedCount === 0 ) return next(appError('blogCategory deletation failed'))

	blogCategories.forEach( (blogCategory) => {
		// delete existing coverPhoto if have
		setTimeout(() => {
			if(blogCategory.image?.secure_url) promisify(fileService.removeFile)(blogCategory.image.secure_url)
		}, 1000)

	})

	const responseData: ResponseData<BlogCategoryDocument[]> = {
		status: 'success',
		// count: blogCategories.length,
		count: deletedCategories.deletedCount,
		data: blogCategories
	}
	res.status(200).json(responseData)
})