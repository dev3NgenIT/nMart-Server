import type { FaqCategoryDocument, FaqCategoryModel } from '@/types/faqCategory'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'


/*
{
	"name": "Returns & Refunds",
},
*/

const faqCategorySchema = new Schema<FaqCategoryDocument>({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},

}, {
	timestamps: true,
	toJSON: {

		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})


export const FaqCategory = model<FaqCategoryDocument, FaqCategoryModel>(Collection.FaqCategory, faqCategorySchema)
export default FaqCategory  