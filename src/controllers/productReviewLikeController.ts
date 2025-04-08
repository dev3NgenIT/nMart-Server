import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { ProductReviewLikeDocument } from '@/types/productReviewLikes'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import * as productReviewLikeDtos from '@/dtos/productReviewLikeDtos'
import ProductReviewLike from '@/models/productReviewLikeModel'


// GET /api/product-review-likes
export const getProductReviewLikes: RequestHandler = catchAsync( async (req, res, next) => {

	let userId = req.params.userId
	if (req.session?.userId && req.params.userId === 'me') userId = req.session?.userId

	const productId = req.params.productId
	const reviewId = req.params.reviewId

	let filter: Record<string, any> = {}
	if (productId) filter = { product: productId.toString() }
	if (userId) filter = { user: userId.toString() };
	if (reviewId) filter = { review: reviewId.toString() };


	const { query, total } = await apiFeatures(ProductReviewLike, req.query, filter)
	const productReviewLikes = await query
	
	const responseData: ResponseData<ProductReviewLikeDocument[]> = {
		status: 'success',
		count: productReviewLikes.length,
		total,
		data: productReviewLikes,
	}
	res.status(200).json( responseData )
})


// POST 	/api/product-review-likes
export const addProductReviewLike: RequestHandler =  catchAsync(async (req, res, next) => {

	const filteredBody = productReviewLikeDtos.filterBodyForUpdateProductReviewLike(req.body)
	const productReviewLike = await ProductReviewLike.create(filteredBody)
	if(!productReviewLike) return next(appError('productReviewLike not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: productReviewLike,
	}
	res.status(201).json( responseData )
})

// GET /api/product-review-likes/:productReviewLikeId
export const getProductReviewLikesById:RequestHandler = catchAsync(async (req, res, next) => {
	const productReviewLikeId = req.params.productReviewLikeId

	const productReviewLike = await ProductReviewLike.findById(productReviewLikeId)
	if(!productReviewLike) return next(appError('productReviewLike not found'))
	
	const responseData: ResponseData<ProductReviewLikeDocument> = {
		status: 'success',
		data: productReviewLike
	}
	res.status(200).json( responseData )
})


// PATCH /api/product-review-likes/:productReviewLikeId
export const updateProductReviewLikesById:RequestHandler = catchAsync(async (req, res, next) => {
	const productReviewLikeId = req.params.productReviewLikeId

	const filteredBody = productReviewLikeDtos.filterBodyForUpdateProductReviewLike(req.body)
	const productReviewLike = await ProductReviewLike.findByIdAndUpdate(productReviewLikeId, filteredBody, { new: true })
	if(!productReviewLike) return next(appError('productReviewLike update failed'))


	const responseData: ResponseData<ProductReviewLikeDocument> = {
		status: 'success',
		data: productReviewLike
	}

	res.status(200).json( responseData )
})


// DELETE /api/product-review-likes/:productReviewLikeId
export const deleteProductReviewLikesById:RequestHandler = catchAsync(async (req, res, next) => {
	const productReviewLikeId = req.params.productReviewLikeId

	const productReviewLike = await ProductReviewLike.findByIdAndDelete(productReviewLikeId)
	if(!productReviewLike) return next(appError('productReviewLike not found'))

	const responseData: ResponseData<ProductReviewLikeDocument> = {
		status: 'success',
		data: productReviewLike
	}
	res.status(200).json( responseData )
})