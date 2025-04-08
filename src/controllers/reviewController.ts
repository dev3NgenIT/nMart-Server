import type { RequestHandler } from 'express'
import type { ResponseData, Image } from '@/types/common'
import type { ReviewDocument } from '@/types/review'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures, getDataUrlSize } from '@/lib/utils'
import { promisify } from 'node:util'
import Review from '@/models/reviewModel'
import * as fileService from '@/services/fileService'
import * as reviewDtos from '@/dtos/reviewDtos'
import { maxImageSize } from '@/types/constants'



// GET /api/reviews
export const getReviews: RequestHandler = catchAsync(async (req, res, next) => {
	let userId = req.params.userId
	if (req.session?.userId && req.params.userId === 'me') userId = req.session?.userId

	const productId = req.params.productId

	let filter: Record<string, any> = {}
	if (productId) filter = { product: productId.toString() }
	if (userId) filter = { user: userId.toString() };

	const { query, total } = await apiFeatures(Review, req.query, filter)
	const reviews = await query

	// Aggregate to calculate the average rating and count of each rating
	const ratingStats = await Review.aggregate([
		{ $match: filter },
		{
			$group: {
				_id: "$rating",
				count: { $sum: 1 }, // Count occurrences of each rating
				avgRating: { $avg: "$rating" }, // Calculate average rating
			},
		},
	])

	// Calculate the overall average rating
	const totalRatings = ratingStats.reduce((sum, stat) => sum + stat.count, 0)
	const averageRating = totalRatings ? ratingStats.reduce((sum, stat) => sum + stat._id * stat.count, 0) / totalRatings : 0

	// Convert ratingStats into a structured format { "5": count, "4": count, ... }
	const ratingSummary = ratingStats.reduce((acc, stat) => {
		acc[stat._id] = stat.count
		return acc
	}, {} as Record<number, number>)

	res.status(200).json({
		status: "success",
		count: reviews.length,
		total,
		average: averageRating.toFixed(2), 			
		ratings: ratingSummary, 							// Example: { "5": 10, "4": 7, "3": 5, "2": 2, "1": 1 }
		data: reviews,
	})
})



// POST 	/api/reviews
export const addReview: RequestHandler =  async (req, res, next) => {

	try {

		// if(req.body.image) {
		// 	const { error, image } = await fileService.uploadFile(req.body.image, '/reviews')
		// 	if(error) return next(appError(`review image upload error: ${error}`))

		// 	// update with new image, if update fialed then delete this image from catch block
		// 	req.body.image = image
		// }

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/reviews')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.images = await Promise.all( images )
		}

		const filteredBody = reviewDtos.filterBodyForCreateReview(req.body)
		const review = await Review.create(filteredBody)
		if(!review) return next(appError('review not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: review,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {

		setTimeout(() => {
			req.body.images.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/reviews/:reviewId
export const getReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId
	const filter = { _id: reviewId }

	// const reviews = await apiFeatures(Review, req.query, filter).limit(1)
	// if(!reviews.length) return next(appError('reviews not found'))

	const review = await Review.findOne(filter)
	if(!review) return next(appError('review not found'))
	
	const responseData: ResponseData<ReviewDocument> = {
		status: 'success',
		data: review
	}
	res.status(200).json( responseData )
})


// PATCH /api/reviews/:reviewId
export const updateReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const reviewId = req.params.reviewId
		// const filter = { _id: reviewId }

		const review = await Review.findById(reviewId)
		if(!review) return next(appError('review not found'))

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/reviews')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.images = await Promise.all( images )
		}

		const filteredBody = reviewDtos.filterBodyForUpdateReview(req.body)
		const updatedReview = await Review.findByIdAndUpdate(reviewId, filteredBody, { new: true })
		if(!updatedReview) return next(appError('review update failed'))

		if(req.body.images) {
			req.body.images = review.images 	// add existing image, so that it can be deleted later

			// delete old image if have
			setTimeout(() => {
				review.images.forEach( (image: Image) => {
					promisify(fileService.removeFile)(image?.secure_url)
				})
			}, 1000)
		}


		const responseData: ResponseData<ReviewDocument> = {
			status: 'success',
			data: updatedReview
		}
		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			req.body.images.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/reviews/:reviewId
export const deleteReviewById:RequestHandler = catchAsync(async (req, res, next) => {
	const reviewId = req.params.reviewId

	const review = await Review.findByIdAndDelete(reviewId)
	if(!review) return next(appError('review not found'))

	// delete existing image if have
	setTimeout(() => {
		review.images.forEach( (image: Image) => {
			promisify(fileService.removeFile)(image?.secure_url)
		})
	}, 1000)


	const responseData: ResponseData<ReviewDocument> = {
		status: 'success',
		data: review
	}
	res.status(200).json( responseData )

})