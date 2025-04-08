import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { OfferDocument } from '@/types/offer'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import Offer from '@/models/offerModel'
import * as fileService from '@/services/fileService'
import * as offerDtos from '@/dtos/offerDtos'
import { isValidObjectId } from 'mongoose'


// GET /api/offers
export const getOffers: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Offer, req.query, filter)
	const offers = await query
	
	const responseData: ResponseData<OfferDocument[]> = {
		status: 'success',
		count: offers.length,
		total,
		data: offers,
	}
	res.status(200).json( responseData )
})


// POST 	/api/offers
export const addOffer: RequestHandler =  async (req, res, next) => {
	try {

		if(req.body.image) {
			const { error, image } = await fileService.uploadFile(req.body.image, '/offers')
			if(error) return next(appError(`offer image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.image = image
		}
		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/offers')
			if(error) return next(appError(`offer logo upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}
		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/offers')
			if(error) return next(appError(`offer logo upload error: ${error}`))

			req.body.banner = banner
		}
		if(req.body.footerBanner) {
			const { error, image: footerBanner } = await fileService.uploadFile(req.body.footerBanner, '/offers')
			if(error) return next(appError(`offer footerBanner upload error: ${error}`))

			req.body.footerBanner = footerBanner
		}


		const filteredBody = offerDtos.filterBodyForCreateOffer(req.body)
		const offer = await Offer.create(filteredBody)
		if(!offer) return next(appError('offer not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: offer,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.image?.secure_url) promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.thumbnail?.secure_url) promisify(fileService.removeFile)(req.body.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.footerBanner?.secure_url) promisify(fileService.removeFile)(req.body.footerBanner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/offers/:offerId
export const getOfferByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const offerId = req.params.offerId
	const filter = (isValidObjectId(offerId)) ?  { _id: offerId } : { slug: offerId }

	const offer = await Offer.findOne(filter)
	if(!offer) return next(appError('offer not found'))
	
	const responseData: ResponseData<OfferDocument> = {
		status: 'success',
		data: offer
	}
	res.status(200).json( responseData )
})


// PATCH /api/offers/:offerId
export const updateOfferByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const offerId = req.params.offerId
		const filter = (isValidObjectId(offerId)) ?  { _id: offerId } : { slug: offerId }

		const offer = await Offer.findOne(filter)
		if(!offer) return next(appError('offer not found'))

		if(req.body.image) {
			const { error, image } = await fileService.uploadFile(req.body.image, '/offers')
			if(error) return next(appError(`offer image upload error: ${error}`))

			// update with new image, if update fialed then delete this image from catch block
			req.body.image = image
		}

		if(req.body.thumbnail) {
			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/offers')
			if(error) return next(appError(`offer thumbnail upload error: ${error}`))

			req.body.thumbnail = thumbnail
		}
		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/offers')
			if(error) return next(appError(`offer banner upload error: ${error}`))

			req.body.banner = banner
		}
		if(req.body.footerBanner) {
			const { error, image: footerBanner } = await fileService.uploadFile(req.body.footerBanner, '/offers')
			if(error) return next(appError(`offer footerBanner upload error: ${error}`))

			req.body.footerBanner = footerBanner
		}

		const filteredBody = offerDtos.filterBodyForUpdateOffer(req.body)
		const updatedCategory = await Offer.findByIdAndUpdate(offerId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('offer update failed'))

		if(req.body.image) {
			req.body.image = offer.image 	// add existing image, so that it can be deleted later

			// delete old image if have
			setTimeout(() => {
				if(offer.image?.secure_url) promisify(fileService.removeFile)(offer.image.secure_url)
			}, 1000)
		}
		if(req.body.thumbnail) {
			req.body.thumbnail = offer.thumbnail 	
			
			setTimeout(() => {
				if(offer.thumbnail?.secure_url) promisify(fileService.removeFile)(offer.thumbnail.secure_url)
			}, 1000)
		}
		if(req.body.banner) {
			req.body.banner = offer.banner 	
			
			setTimeout(() => {
				if(offer.banner?.secure_url) promisify(fileService.removeFile)(offer.banner.secure_url)
			}, 1000)
		}
		if(req.body.footerBanner) {
			req.body.footerBanner = offer.footerBanner 	
			
			setTimeout(() => {
				if(offer.footerBanner?.secure_url) promisify(fileService.removeFile)(offer.footerBanner.secure_url)
			}, 1000)
		}


		const responseData: ResponseData<OfferDocument> = {
			status: 'success',
			data: updatedCategory
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.image?.secure_url) promisify(fileService.removeFile)(req.body.image.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.thumbnail?.secure_url) promisify(fileService.removeFile)(req.body.thumbnail.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.footerBanner?.secure_url) promisify(fileService.removeFile)(req.body.footerBanner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/offers/:offerId
export const deleteOfferByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const offerId = req.params.offerId
	const filter = (isValidObjectId(offerId)) ?  { _id: offerId } : { slug: offerId }

	const offer = await Offer.findOneAndDelete(filter)
	if(!offer) return next(appError('offer not found'))

	// delete existing image if have
	setTimeout(() => {
		if(offer.image?.secure_url) promisify(fileService.removeFile)(offer.image.secure_url)
	}, 1000)
	setTimeout(() => {
		if(offer.thumbnail?.secure_url) promisify(fileService.removeFile)(offer.thumbnail.secure_url)
	}, 1000)
	setTimeout(() => {
		if(offer.banner?.secure_url) promisify(fileService.removeFile)(offer.banner.secure_url)
	}, 1000)
	setTimeout(() => {
		if(offer.footerBanner?.secure_url) promisify(fileService.removeFile)(offer.footerBanner.secure_url)
	}, 1000)


	const responseData: ResponseData<OfferDocument> = {
		status: 'success',
		data: offer
	}
	res.status(200).json( responseData )
})