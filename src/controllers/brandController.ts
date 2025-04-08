import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { BrandDocument } from '@/types/brand'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import Brand from '@/models/brandModel'
import * as fileService from '@/services/fileService'
import * as brandDtos from '@/dtos/brandDtos'


// GET /api/brands
export const getBrands: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Brand, req.query, filter)
	const brands = await query
	
	const responseData: ResponseData<BrandDocument[]> = {
		status: 'success',
		count: brands.length,
		total,
		data: brands,
	}
	res.status(200).json( responseData )
})


// POST 	/api/brands
export const addBrand: RequestHandler =  async (req, res, next) => {
	try {
		if(req.body.logo) {
			const { error, image: logo } = await fileService.uploadFile(req.body.logo, '/brands')
			if(error) return next(appError(`brand logo upload error: ${error}`))

			// update with new logo, if update fialed then delete this logo from catch block
			req.body.logo = logo
		}

		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/brands')
			if(error) return next(appError(`brand logo upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}

		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/brands')
			if(error) return next(appError(`brand logo upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = brandDtos.filterBodyForCreateBrand(req.body)
		const brand = await Brand.create(filteredBody)
		if(!brand) return next(appError('brand not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: brand,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.logo?.secure_url) promisify(fileService.removeFile)(req.body.logo.secure_url)
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

// GET /api/brands/:brandId
export const getBrandById:RequestHandler = catchAsync(async (req, res, next) => {
	const brandId = req.params.brandId
	const filter = { _id: brandId }

	const brand = await Brand.findOne(filter)
	if(!brand) return next(appError('brand not found'))
	
	const responseData: ResponseData<BrandDocument> = {
		status: 'success',
		data: brand
	}
	res.status(200).json( responseData )
})


// PATCH /api/brands/:brandId
export const updateBrandById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const brandId = req.params.brandId
		// const filter = { _id: brandId }

		const brand = await Brand.findById(brandId)
		if(!brand) return next(appError('brand not found'))

		if(req.body.logo) {
			const { error, image: logo } = await fileService.uploadFile(req.body.logo, '/brands')
			if(error) return next(appError(`brand logo upload error: ${error}`))

			req.body.logo = logo
		}
		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/brands')
			if(error) return next(appError(`brand thumbnail upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}
		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/brands')
			if(error) return next(appError(`brand banner upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = brandDtos.filterBodyForUpdateBrand(req.body)
		const updatedBrand = await Brand.findByIdAndUpdate(brandId, filteredBody, { new: true })
		if(!updatedBrand) return next(appError('brand update failed'))


		if(req.body.logo) {
			req.body.logo = brand.logo 	
			
			setTimeout(() => {
				if(brand.logo?.secure_url) promisify(fileService.removeFile)(brand.logo.secure_url)
			}, 1000)
		}

		if(req.body.thumbnail) {
			req.body.thumbnail = brand.thumbnail 	
			
			setTimeout(() => {
				if(brand.thumbnail?.secure_url ) promisify(fileService.removeFile)(brand.thumbnail.secure_url)
			}, 1000)
		}
		if(req.body.banner) {
			req.body.banner = brand.banner 	
			
			setTimeout(() => {
				if(brand.banner?.secure_url) promisify(fileService.removeFile)(brand.banner.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<BrandDocument> = {
			status: 'success',
			data: updatedBrand
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.logo?.secure_url) promisify(fileService.removeFile)(req.body.logo.secure_url)
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


// DELETE /api/brands/:brandId
export const deleteBrandById:RequestHandler = catchAsync(async (req, res, next) => {
	const brandId = req.params.brandId

	const brand = await Brand.findByIdAndDelete(brandId)
	if(!brand) return next(appError('brand not found'))

	// delete existing image if have
	setTimeout(() => {
		if(brand.logo?.secure_url) promisify(fileService.removeFile)(brand.logo.secure_url)
	}, 1000)
	setTimeout(() => {
		if(brand.thumbnail?.secure_url) promisify(fileService.removeFile)(brand.thumbnail.secure_url)
	}, 1000)
	setTimeout(() => {
		if(brand.banner?.secure_url) promisify(fileService.removeFile)(brand.banner.secure_url)
	}, 1000)


	const responseData: ResponseData<BrandDocument> = {
		status: 'success',
		data: brand
	}
	res.status(200).json( responseData )
})



// => DELETE /api/brands/many
export const deletelBrandsByIds:RequestHandler = catchAsync( async (req, res, next) => {

	const brandIds = req.body.brandIds || []
	const brands = await Brand.find({_id: { $in: brandIds }})
	if(!brands.length) return next(appError('no brands found'))

	const deletedBrands = await Brand.deleteMany({_id: { $in: brandIds }})
	if(deletedBrands.deletedCount === 0 ) return next(appError('brand deletation failed'))

	brands.forEach( (brand) => {
		// delete existing coverPhoto if have
		setTimeout(() => {
			if(brand.logo?.secure_url) promisify(fileService.removeFile)(brand.logo.secure_url)
		}, 1000)
		setTimeout(() => {
			if(brand.thumbnail?.secure_url) promisify(fileService.removeFile)(brand.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(brand.banner?.secure_url) promisify(fileService.removeFile)(brand.banner.secure_url)
		}, 1000)

	})

	const responseData: ResponseData<BrandDocument[]> = {
		status: 'success',
		// count: brands.length,
		count: deletedBrands.deletedCount,
		data: brands
	}
	res.status(200).json(responseData)
})