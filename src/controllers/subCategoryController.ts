import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { SubCategoryDocument } from '@/types/subCategory'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import SubCategory from '@/models/subCategoryModel'
import * as fileService from '@/services/fileService'
import * as subCategoryDtos from '@/dtos/subCategoryDtos'
import { isValidObjectId } from 'mongoose'


// GET /api/sub-categories
export const getSubCagegories: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(SubCategory, req.query, filter)
	const subCategories = await query
	
	const responseData: ResponseData<SubCategoryDocument[]> = {
		status: 'success',
		count: subCategories.length,
		total,
		data: subCategories,
	}
	res.status(200).json( responseData )
})


// POST 	/api/sub-categories
export const addSubCategory: RequestHandler =  async (req, res, next) => {
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

		const filteredBody = subCategoryDtos.filterBodyForCreateSubCategory(req.body)
		const subCategory = await SubCategory.create(filteredBody)
		if(!subCategory) return next(appError('subCategory not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: subCategory,
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

// GET /api/sub-categories/:subCategoryId
export const getSubCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const subCategoryId = req.params.subCategoryId
	const filter = (isValidObjectId(subCategoryId)) ?  { _id: subCategoryId } : { slug: subCategoryId }

	// const categories = await apiFeatures(subCategory, req.query, filter).limit(1)
	// if(!categories.length) return next(appError('categories not found'))

	const subCategory = await SubCategory.findOne(filter)
	if(!subCategory) return next(appError('subCategory not found'))
	
	const responseData: ResponseData<SubCategoryDocument> = {
		status: 'success',
		data: subCategory
	}
	res.status(200).json( responseData )
})


// PATCH /api/sub-categories/:subCategoryId
export const updateSubCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const subCategoryId = req.params.subCategoryId
		const filter = (isValidObjectId(subCategoryId)) ?  { _id: subCategoryId } : { slug: subCategoryId }

		const subCategory = await SubCategory.findOne(filter)
		if(!subCategory) return next(appError('subCategory not found'))

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

		const filteredBody = subCategoryDtos.filterBodyForUpdateSubCategory(req.body)
		const updatedCategory = await SubCategory.findByIdAndUpdate(subCategoryId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('subCategory update failed'))

		if(req.body.icon) {
			req.body.icon = subCategory.icon 	
			
			setTimeout(() => {
				if(subCategory.icon?.secure_url) promisify(fileService.removeFile)(subCategory.icon.secure_url)
			}, 1000)
		}

		if(req.body.thumbnail) {
			req.body.thumbnail = subCategory.thumbnail 	
			
			setTimeout(() => {
				if(subCategory.thumbnail?.secure_url) promisify(fileService.removeFile)(subCategory.thumbnail.secure_url)
			}, 1000)
		}
		if(req.body.banner) {
			req.body.banner = subCategory.banner 	
			
			setTimeout(() => {
				if(subCategory.banner?.secure_url) promisify(fileService.removeFile)(subCategory.banner.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<SubCategoryDocument> = {
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


// DELETE /api/sub-categories/:subCategoryId
export const deleteSubCategoryByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const subCategoryId = req.params.subCategoryId
	const filter = (isValidObjectId(subCategoryId)) ?  { _id: subCategoryId } : { slug: subCategoryId }

	const subCategory = await SubCategory.findOneAndDelete(filter)
	if(!subCategory) return next(appError('subCategory not found'))

	// delete existing image if have
	setTimeout(() => {
		if(subCategory.icon?.secure_url) promisify(fileService.removeFile)(subCategory.icon.secure_url)
	}, 1000)
	setTimeout(() => {
		if(subCategory.thumbnail?.secure_url) promisify(fileService.removeFile)(subCategory.thumbnail.secure_url)
	}, 1000)
	setTimeout(() => {
		if(subCategory.banner?.secure_url) promisify(fileService.removeFile)(subCategory.banner.secure_url)
	}, 1000)


	const responseData: ResponseData<SubCategoryDocument> = {
		status: 'success',
		data: subCategory
	}
	res.status(200).json( responseData )

})



// => DELETE /api/sub-categories/many
export const deletelSubCategoriesByIds:RequestHandler = catchAsync( async (req, res, next) => {

	const subCategoryIds = req.body.subCategoryIds || []
	const subCategories = await SubCategory.find({_id: { $in: subCategoryIds }})
	if(!subCategories.length) return next(appError('no subCategories found'))

	const deletedSubCategories = await SubCategory.deleteMany({_id: { $in: subCategoryIds }})
	if(deletedSubCategories.deletedCount === 0 ) return next(appError('subCategory deletation failed'))

	subCategories.forEach( (subCategory) => {
		// delete existing coverPhoto if have
		setTimeout(() => {
			if(subCategory.icon?.secure_url) promisify(fileService.removeFile)(subCategory.icon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(subCategory.thumbnail?.secure_url) promisify(fileService.removeFile)(subCategory.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(subCategory.banner?.secure_url) promisify(fileService.removeFile)(subCategory.banner.secure_url)
		}, 1000)

	})

	const responseData: ResponseData<SubCategoryDocument[]> = {
		status: 'success',
		// count: subCategories.length,
		count: deletedSubCategories.deletedCount,
		data: subCategories
	}
	res.status(200).json(responseData)
})