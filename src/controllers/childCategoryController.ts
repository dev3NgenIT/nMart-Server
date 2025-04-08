import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { ChildCategoryDocument } from '@/types/childCategory'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import ChildCategory from '@/models/childCategoryModel'
import * as fileService from '@/services/fileService'
import * as childCategoryDtos from '@/dtos/childCategoryDtos'


// GET /api/child-categories
export const getChildCagegories: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(ChildCategory, req.query, filter)
	const childCategories = await query
	
	const responseData: ResponseData<ChildCategoryDocument[]> = {
		status: 'success',
		count: childCategories.length,
		total,
		data: childCategories,
	}
	res.status(200).json( responseData )
})


// POST 	/api/child-categories
export const addChildCategory: RequestHandler =  async (req, res, next) => {
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

		const filteredBody = childCategoryDtos.filterBodyForCreateChildCategory(req.body)
		const childCategory = await ChildCategory.create(filteredBody)
		if(!childCategory) return next(appError('childCategory not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: childCategory,
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

// GET /api/child-categories/:childCategoryId
export const getChildCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const childCategoryId = req.params.childCategoryId
	const filter = { _id: childCategoryId }

	// const categories = await apiFeatures(childCategory, req.query, filter).limit(1)
	// if(!categories.length) return next(appError('categories not found'))

	const childCategory = await ChildCategory.findOne(filter)
	if(!childCategory) return next(appError('childCategory not found'))
	
	const responseData: ResponseData<ChildCategoryDocument> = {
		status: 'success',
		data: childCategory
	}
	res.status(200).json( responseData )
})


// PATCH /api/child-categories/:childCategoryId
export const updateChildCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const childCategoryId = req.params.childCategoryId
		// const filter = { _id: childCategoryId }

		const childCategory = await ChildCategory.findById(childCategoryId)
		if(!childCategory) return next(appError('childCategory not found'))

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

		const filteredBody = childCategoryDtos.filterBodyForUpdateChildCategory(req.body)
		const updatedCategory = await ChildCategory.findByIdAndUpdate(childCategoryId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('childCategory update failed'))

		if(req.body.icon) {
			req.body.icon = childCategory.icon 	
			
			setTimeout(() => {
				if(childCategory.icon?.secure_url) promisify(fileService.removeFile)(childCategory.icon.secure_url)
			}, 1000)
		}

		if(req.body.thumbnail) {
			req.body.thumbnail = childCategory.thumbnail 	
			
			setTimeout(() => {
				if(childCategory.thumbnail?.secure_url) promisify(fileService.removeFile)(childCategory.thumbnail.secure_url)
			}, 1000)
		}
		if(req.body.banner) {
			req.body.banner = childCategory.banner 	
			
			setTimeout(() => {
				if(childCategory.banner?.secure_url) promisify(fileService.removeFile)(childCategory.banner.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<ChildCategoryDocument> = {
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


// DELETE /api/child-categories/:childCategoryId
export const deleteChildCategoryById:RequestHandler = catchAsync(async (req, res, next) => {
	const childCategoryId = req.params.childCategoryId

	const childCategory = await ChildCategory.findByIdAndDelete(childCategoryId)
	if(!childCategory) return next(appError('childCategory not found'))

	// delete existing image if have
	setTimeout(() => {
		if(childCategory.icon?.secure_url) promisify(fileService.removeFile)(childCategory.icon.secure_url)
	}, 1000)
	setTimeout(() => {
		if(childCategory.thumbnail?.secure_url) promisify(fileService.removeFile)(childCategory.thumbnail.secure_url)
	}, 1000)
	setTimeout(() => {
		if(childCategory.banner?.secure_url) promisify(fileService.removeFile)(childCategory.banner.secure_url)
	}, 1000)


	const responseData: ResponseData<ChildCategoryDocument> = {
		status: 'success',
		data: childCategory
	}
	res.status(200).json( responseData )

})