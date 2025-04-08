import type { Types, Document, Model } from 'mongoose'

export type WishList = {
	product: Types.ObjectId
	user: Types.ObjectId
}
export type WishListDocument = Document & WishList

export type CreateWishList = WishList
export type UpdateWishList = WishList

export type WishListModel = Model<WishListDocument> & { }