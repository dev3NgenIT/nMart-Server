import type { FaqDocument, FaqModel } from '@/types/faq'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'


/*
{
	"category": "Returns & Refunds",
	"question": "What is your return policy?",
	"answer": "You can return any item within 30 days of purchase for a full refund.",
	"listOrder": 1,
	"isVisible": true
},
*/

const faqSchema = new Schema<FaqDocument>({
	category: {
		type: String,
		required: true,
		// unique: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},
	question: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},
	answer: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 5000,
	},
	listOrder: {
		type: Number,
		// unique: true,
	},
	isVisible: {
		type: Boolean,
		default: true
	},

}, {
	timestamps: true,
	toJSON: {

		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})


export const Faq = model<FaqDocument, FaqModel>(Collection.Faq, faqSchema)
export default Faq