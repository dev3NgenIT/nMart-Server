import type { ProductReviewLikeDocument, ProductReviewLikeModel } from '@/types/productReviewLikes'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'


/*
{
	"review": "67986d5360c5024225bf3e83",
	"user": "67986d5360c5024225bf3e52",
}
*/


const productReviewLikeSchema = new Schema<ProductReviewLikeDocument>({
	review: {
		type: Schema.Types.ObjectId,
		ref: Collection.Product,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true,
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: Collection.Product,
		required: true,
	},

}, {
	timestamps: true,
	toJSON: {

		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})

// Add a compound index to enforce uniqueness on the combination of `review` and `user`
productReviewLikeSchema.index({ review: 1, user: 1 }, { unique: true })


export const ProductReviewLike = model<ProductReviewLikeDocument, ProductReviewLikeModel>(Collection.ProductReviewLike, productReviewLikeSchema)
export default ProductReviewLike