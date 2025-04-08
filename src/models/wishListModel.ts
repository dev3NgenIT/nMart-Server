import type { WishListDocument, WishListModel } from '@/types/withlist'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/customTranform'


/*
{
	"product": "67986d5360c5024225bf3e83",
	"user": "67986d5360c5024225bf3e52",
}

{
	"product": "67986d5360c5024225bf3e83",
	"user": "67986d5360c5024225bf3e52",
}
*/


const wishListSchema = new Schema<WishListDocument>({
	product: {
		type: Schema.Types.ObjectId,
		ref: Collection.Product,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
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

// Add a compound index to enforce uniqueness on the combination of `product` and `user`
wishListSchema.index({ product: 1, user: 1 }, { unique: true });


export const WishList = model<WishListDocument, WishListModel>(Collection.WishList, wishListSchema)
export default WishList