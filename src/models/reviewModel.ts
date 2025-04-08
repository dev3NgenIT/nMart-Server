import type { ReviewDocument } from '@/types/review'
import type { Model } from 'mongoose'
import { Schema, model } from 'mongoose'
import { sanitizeSchema } from '@/services/sanitizeService'
import { Collection } from '@/types/constants'

/*
{
	"user": "user-asdfasdjfa",
	"product": "product-asdfalksdjfasjj",
	"review": "this is my review 1",
	"image": "data:...",
	"rating": 5
}
*/

const reviewSchema = new Schema<ReviewDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: Collection.Product,
		required: true
	},
	review: { 								// Review message
		type: String,
		// required: true,
		lowercase: true,
		trim: true,
		minLength: 3,
		maxLength: 200,
	},
	images: [{
		public_id: String,
		secure_url: String,
	}],

	rating: { 							// will be calculated from 'reviews' collection
		type: Number,
		min: 0,
		max: 5,
		default: 4
	},

	like: {
		type: Number,
		default: 0
	},
	// likes: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: Collection.User
	// 	// required: true
	// }],

}, {
	timestamps: true,
	toJSON: {
		transform(_doc, ret, _options) {
			ret.id = ret._id
			delete ret._id
			delete ret.__v

			// const imageFields = ['image', 'thumbnail', 'banner', 'footerBanner']
			// customTransform(ret, imageFields )
		},
	}
})

reviewSchema.plugin(sanitizeSchema)

reviewSchema.pre('save', function(next) {
	this.rating = +this.rating 	

	next()
})


reviewSchema.pre(/^find/, function (this: ReviewDocument, next) {
	// this.populate('user')

	next()
})


export const Review = model<ReviewDocument, Model<ReviewDocument> >(Collection.Review, reviewSchema)
export default Review
