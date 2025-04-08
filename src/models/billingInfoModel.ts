import type { BillingInfoDocument, BillingInfoModel } from '@/types/billingInfo'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/customTranform'
import isEmail from 'validator/lib/isEmail'


/*
{
	"user": "67986d5360c5024225bf3e52",
	"email": "riajul@gmail.com",
}

*/


const billingInfoSchema = new Schema<BillingInfoDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		unique: true,
		validate: isEmail
	},
	phone: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 8,
	},
	street: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	postCode: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	region: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	city: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},
	country: {
		type: String,
		lowercase: true,
		trim: true,
		required: true
	},

}, {
	timestamps: true,
	toJSON: {
		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})

billingInfoSchema.index({ user: 1 }, { unique: true });


export const BillingInfo = model<BillingInfoDocument, BillingInfoModel>(Collection.BillingInfo, billingInfoSchema)
export default BillingInfo