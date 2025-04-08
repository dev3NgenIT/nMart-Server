import type { FaqDocument, FaqModel } from '@/types/faq'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'
import { FaqQuestionDocument, FaqQuestionModel } from '@/types/faqQuestion'
import isEmail from 'validator/lib/isEmail'


/*
{
	"user": "user.id",
	"name": "user.name",
	"email": "user.email",
	"message": "your message goes here "
},
*/

const faqQuestionSchema = new Schema<FaqQuestionDocument>({
	// user: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: Collection.User,
	// 	required: true
	// },
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: isEmail
	},
	message: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 5000,
	},

}, {
	timestamps: true,
	toJSON: {

		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})


export const FaqQuestion = model<FaqQuestionDocument, FaqQuestionModel>(Collection.FaqQuestion, faqQuestionSchema)
export default FaqQuestion