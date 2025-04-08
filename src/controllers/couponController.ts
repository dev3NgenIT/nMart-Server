import type { RequestHandler } from 'express'
import type { ResponseData, Image } from '@/types/common'
import type { CouponDocument } from '@/types/coupon'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures, getDataUrlSize } from '@/lib/utils'
import { promisify } from 'util'
import * as couponDtos from '@/dtos/couponDtos'
import Coupon from '@/models/couponModel'

import * as fileService from '@/services/fileService'
import { isValidObjectId, Types } from 'mongoose'
import { maxImageSize } from '@/types/constants'


// GET /api/coupons
export const getCoupons: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Coupon, req.query, filter)
	const coupons = await query
	
	const responseData: ResponseData<CouponDocument[]> = {
		status: 'success',
		count: coupons.length,
		total,
		data: coupons,
	}
	res.status(200).json( responseData )
})


// POST 	/api/coupons
export const addCoupon: RequestHandler =  catchAsync( async (req, res, next) => {
	try {
		if(req.body.rightBanner) {
			if( req.body.rightBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.rightBanner)
				if(imageSize > maxImageSize) return next(appError(`rightBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: rightBanner } = await fileService.uploadFile(req.body.rightBanner, '/coupons')
			if(error) return next(appError(`rightBanner image upload error: ${error}`))
			req.body.rightBanner = rightBanner
		}


		if(req.body.banners?.length) {
			const banners = req.body.banners.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/coupons')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.banners = await Promise.all( banners )
		}

		const filteredBody = couponDtos.filterBodyForCreateCoupon(req.body)
		// filteredBody.code = generateNMCode('NMC') 															// => NMC202503181 	=> NMYYYYMMDDN
		filteredBody.code = new Types.ObjectId()
		filteredBody.coupon = filteredBody.code 

		const coupon = await Coupon.create(filteredBody)
		if(!coupon) return next(appError('coupon not found'))

		coupon.coupon = ''

		const responseData: ResponseData = {
			status: 'success',
			data: coupon,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.rightBanner?.secure_url)
		}, 1000)

		setTimeout(() => {
			req.body.banners.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}

})

// GET /api/coupons/:couponId
export const getCouponByIdOrCouponCode:RequestHandler = catchAsync(async (req, res, next) => {
	const couponId = req.params.couponId
	const filter = (isValidObjectId(couponId)) ? { _id: couponId } : { code: couponId }

	const coupon = await Coupon.findOne(filter)
	if(!coupon) return next(appError('coupon not found'))
	
	const responseData: ResponseData<CouponDocument> = {
		status: 'success',
		data: coupon
	}
	res.status(200).json( responseData )
})


// GET /api/coupons/:couponCode/verify
export const verifyCouponByCode:RequestHandler = catchAsync(async (req, res, next) => {
	const couponCode = req.params.couponCode

	const coupon = await Coupon.findOne({ code: couponCode }).select('+coupon')
	if(!coupon) return next(appError('coupon not found'))
	if(coupon.isUsed) return next(appError('this coupon already used'))
	
	const isCouponVerified = await coupon.verifyCoupon( coupon.code ) 
	if(!isCouponVerified) return next(appError('coupon verification failed: changes are expired '))

	coupon.coupon = ''

	const responseData: ResponseData = {
		status: 'success',
		// data: coupon,
		message: 'coupon verification successfull'
	}
	res.status(200).json( responseData )
})


// PATCH /api/coupons/:couponId
export const updateCouponById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const couponId = req.params.couponId
		const coupon = await Coupon.findById(couponId)
		if(!coupon) return next(appError('coupon not found'))

		if(req.body.rightBanner) {
			if( req.body.rightBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.rightBanner)
				if(imageSize > maxImageSize) return next(appError(`rightBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: rightBanner } = await fileService.uploadFile(req.body.rightBanner, '/coupons')
			if(error) return next(appError(`rightBanner image upload error: ${error}`))

			// update with new image
			req.body.rightBanner = rightBanner
		}

		if(req.body.banners?.length) {
			const banners = req.body.banners.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`banners size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/coupons')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.banners = await Promise.all( banners )
		}


		const filteredBody = couponDtos.filterBodyForUpdateCoupon(req.body)
		const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, filteredBody, { new: true })
		if(!updatedCoupon) return next(appError('coupon update failed'))

		if(req.body.rightBanner) {
			req.body.rightBanner = coupon.rightBanner 	

			setTimeout(() => {
				if(coupon.rightBanner?.secure_url) promisify(fileService.removeFile)(coupon.rightBanner.secure_url)
			}, 1000)
		}

		if(req.body.banners && coupon.banners?.length) {
			req.body.banners = coupon.banners

			coupon.banners.forEach( (banner: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(banner.secure_url)
				}, 1000)
			})
		}

		const responseData: ResponseData<CouponDocument> = {
			status: 'success',
			data: updatedCoupon
		}
		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.rightBanner?.secure_url) promisify(fileService.removeFile)(req.body.rightBanner.secure_url)
		}, 1000)

		if(req.body.banners?.length) {
			req.body.banners.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/coupons/:couponId
export const deleteCouponById:RequestHandler = catchAsync(async (req, res, next) => {
	const couponId = req.params.couponId

	const coupon = await Coupon.findByIdAndDelete(couponId)
	if(!coupon) return next(appError('coupon not found'))


	setTimeout(() => {
		if(coupon.rightBanner?.secure_url) promisify(fileService.removeFile)(coupon.rightBanner.secure_url)
	}, 1000)

	// delete existing banners if have
	coupon.banners?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})

	const responseData: ResponseData<CouponDocument> = {
		status: 'success',
		data: coupon
	}
	res.status(200).json( responseData )
})