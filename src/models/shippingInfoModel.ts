import type { ShippingInfoDocument, ShippingInfoModel } from '@/types/shippingInfo'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/customTranform'
import isEmail from 'validator/lib/isEmail'


/*
{
	"user": "67986d5360c5024225bf3e52",
	"fname": "riajul",
	"lname": "islam",
	"email": "riajul@gmail.com",
	"phone": "+8801957500605",
	"street": "mahfuza tower",
	"postCode": "52542",
	"region": "dhaka",
	"city": "dhaka",
	"country": "bangladesh"
}

*/


const shippingInfoSchema = new Schema<ShippingInfoDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true,
	},
	fname: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 30,
	},
	lname: {
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

shippingInfoSchema.index({ user: 1 }, { unique: true });


export const ShippingInfo = model<ShippingInfoDocument, ShippingInfoModel>(Collection.ShippingInfo, shippingInfoSchema)
export default ShippingInfo