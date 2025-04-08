import type { SubscribeDocument, SubscribeModel } from '@/types/subscribe'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/customTranform'
import isEmail from 'validator/lib/isEmail'


/*
{
	"user": "67986d5360c5024225bf3e52",
	"email": "user@gmail.com",
}
*/


const subscribeSchema = new Schema<SubscribeDocument>({
	// user: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: Collection.User,
	// 	// required: true,
	// },
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true,
		validate: isEmail
	}

}, {
	timestamps: true,
	toJSON: {
		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})

// Add a compound index to enforce uniqueness on the combination of `email` and `user`
subscribeSchema.index({ email: 1, user: 1 }, { unique: true });


export const Subscribe = model<SubscribeDocument, SubscribeModel>(Collection.Subscribe, subscribeSchema)
export default Subscribe