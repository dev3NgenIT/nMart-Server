import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { WishListDocument } from '@/types/withlist'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import * as wishListDtos from '@/dtos/wishListDtos'
import { isValidObjectId } from 'mongoose'
import WishList from '@/models/wishListModel'


// GET /api/wishlists
export const getWishLists: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(WishList, req.query, filter)
	const wishlists = await query
	
	const responseData: ResponseData<WishListDocument[]> = {
		status: 'success',
		count: wishlists.length,
		total,
		data: wishlists,
	}
	res.status(200).json( responseData )
})


// POST 	/api/wishlists
export const addWishList: RequestHandler =  catchAsync(async (req, res, next) => {

	const filteredBody = wishListDtos.filterBodyForCreateWishList(req.body)
	const wishList = await WishList.create(filteredBody)
	if(!wishList) return next(appError('wishList not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: wishList,
	}
	res.status(201).json( responseData )
})

// GET /api/wishlists/:wishListId
export const getWishListById:RequestHandler = catchAsync(async (req, res, next) => {
	const wishListId = req.params.wishListId

	const wishList = await WishList.findById(wishListId)
	if(!wishList) return next(appError('wishList not found'))
	
	const responseData: ResponseData<WishListDocument> = {
		status: 'success',
		data: wishList
	}
	res.status(200).json( responseData )
})


// PATCH /api/wishlists/:wishListId
export const updateWishListById:RequestHandler = catchAsync(async (req, res, next) => {
	const wishListId = req.params.wishListId

	const filteredBody = wishListDtos.filterBodyForUpdateWishList(req.body)
	const wishList = await WishList.findByIdAndUpdate(wishListId, filteredBody, { new: true })
	if(!wishList) return next(appError('wishList update failed'))


	const responseData: ResponseData<WishListDocument> = {
		status: 'success',
		data: wishList
	}

	res.status(200).json( responseData )
})


// DELETE /api/wishlists/:wishListId
export const deleteWishListById:RequestHandler = catchAsync(async (req, res, next) => {
	const wishListId = req.params.wishListId

	const wishList = await WishList.findByIdAndDelete(wishListId)
	if(!wishList) return next(appError('wishList not found'))

	const responseData: ResponseData<WishListDocument> = {
		status: 'success',
		data: wishList
	}
	res.status(200).json( responseData )
})