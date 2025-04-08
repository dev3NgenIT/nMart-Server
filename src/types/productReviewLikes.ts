import type { Types, Document, Model } from 'mongoose'

export type ProductReviewLike = {
	review: Types.ObjectId
	user: Types.ObjectId
	product: Types.ObjectId
}
export type ProductReviewLikeDocument = Document & ProductReviewLike

export type CreateProductReviewLike = ProductReviewLike
export type UpdateProductReviewLike = ProductReviewLike

export type ProductReviewLikeModel = Model<ProductReviewLikeDocument> & { }