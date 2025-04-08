import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { CategoryDocument } from '@/types/category'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import Category from '@/models/categoryModel'
import * as fileService from '@/services/fileService'
import * as categoryDtos from '@/dtos/categoryDtos'
import { isValidObjectId } from 'mongoose'


// GET /api/categories
export const getCagegories: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Category, req.query, filter)
	const categories = await query
	
	const responseData: ResponseData<CategoryDocument[]> = {
		status: 'success',
		count: categories.length,
		total,
		data: categories,
	}
	res.status(200).json( responseData )
})


// POST 	/api/categories
export const addCategory: RequestHandler =  async (req, res, next) => {
	try {

		if(req.body.icon) {
			const { error, image: icon } = await fileService.uploadFile(req.body.icon, '/categories')
			if(error) return next(appError(`category icon upload error: ${error}`))

			req.body.icon = icon
		}

		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/categories')
			if(error) return next(appError(`category thumbnail upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}

		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/categories')
			if(error) return next(appError(`category logo upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = categoryDtos.filterBodyForCreateCategory(req.body)
		const category = await Category.create(filteredBody)
		if(!category) return next(appError('category not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: category,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.icon?.secure_url) promisify(fileService.removeFile)(req.body.icon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.thumbnail?.secure_url) promisify(fileService.removeFile)(req.body.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/categories/:categoryId
export const getCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId
	const filter = (isValidObjectId(categoryId)) ?  { _id: categoryId } : { slug: categoryId }

	// const categories = await apiFeatures(Category, req.query, filter).limit(1)
	// if(!categories.length) return next(appError('categories not found'))

	const category = await Category.findOne(filter)
	if(!category) return next(appError('category not found'))
	
	const responseData: ResponseData<CategoryDocument> = {
		status: 'success',
		data: category
	}
	res.status(200).json( responseData )
})


// PATCH /api/categories/:categoryId
export const updateCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const categoryId = req.params.categoryId
		const filter = (isValidObjectId(categoryId)) ?  { _id: categoryId } : { slug: categoryId }

		const category = await Category.findOne(filter)
		if(!category) return next(appError('category not found'))

		if(req.body.icon) {
			const { error, image: icon } = await fileService.uploadFile(req.body.icon, '/categories')
			if(error) return next(appError(`category icon upload error: ${error}`))

			req.body.icon = icon
		}
		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/categories')
			if(error) return next(appError(`category thumbnail upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}
		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/categories')
			if(error) return next(appError(`category banner upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = categoryDtos.filterBodyForUpdateCategory(req.body)
		const updatedCategory = await Category.findByIdAndUpdate(categoryId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('category update failed'))

		if(req.body.icon) {
			req.body.icon = category.icon 	
			
			setTimeout(() => {
				if(category.icon?.secure_url) promisify(fileService.removeFile)(category.icon.secure_url)
			}, 1000)
		}

		if(req.body.thumbnail) {
			req.body.thumbnail = category.thumbnail 	
			
			setTimeout(() => {
				if(category.thumbnail?.secure_url) promisify(fileService.removeFile)(category.thumbnail.secure_url)
			}, 1000)
		}
		if(req.body.banner) {
			req.body.banner = category.banner 	
			
			setTimeout(() => {
				if(category.banner?.secure_url) promisify(fileService.removeFile)(category.banner.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<CategoryDocument> = {
			status: 'success',
			data: updatedCategory
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.icon?.secure_url) promisify(fileService.removeFile)(req.body.icon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.thumbnail?.secure_url) promisify(fileService.removeFile)(req.body.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/categories/:categoryId
export const deleteCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const categoryId = req.params.categoryId
	const filter = (isValidObjectId(categoryId)) ?  { _id: categoryId } : { slug: categoryId }

	const category = await Category.findOneAndDelete(filter)
	if(!category) return next(appError('category not found'))

	// delete existing image if have
	setTimeout(() => {
		if(category.icon?.secure_url) promisify(fileService.removeFile)(category.icon.secure_url)
	}, 1000)
	setTimeout(() => {
		if(category.thumbnail?.secure_url) promisify(fileService.removeFile)(category.thumbnail.secure_url)
	}, 1000)
	setTimeout(() => {
		if(category.banner?.secure_url) promisify(fileService.removeFile)(category.banner.secure_url)
	}, 1000)


	const responseData: ResponseData<CategoryDocument> = {
		status: 'success',
		data: category
	}
	res.status(200).json( responseData )
})



// => DELETE /api/categories/many
export const deletelCategoriesByIds:RequestHandler = catchAsync( async (req, res, next) => {

	const categoryIds = req.body.categoryIds || []
	const categories = await Category.find({_id: { $in: categoryIds }})
	if(!categories.length) return next(appError('no categories found'))

	const deletedCategories = await Category.deleteMany({_id: { $in: categoryIds }})
	if(deletedCategories.deletedCount === 0 ) return next(appError('category deletation failed'))

	categories.forEach( (category) => {
		// delete existing coverPhoto if have
		setTimeout(() => {
			if(category.icon?.secure_url) promisify(fileService.removeFile)(category.icon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(category.thumbnail?.secure_url) promisify(fileService.removeFile)(category.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(category.banner?.secure_url) promisify(fileService.removeFile)(category.banner.secure_url)
		}, 1000)

	})

	const responseData: ResponseData<CategoryDocument[]> = {
		status: 'success',
		// count: categories.length,
		count: deletedCategories.deletedCount,
		data: categories
	}
	res.status(200).json(responseData)
})