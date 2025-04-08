import type { Model } from 'mongoose'
import type { ContactUsDocument } from '@/types/contactUs'
import { model, Schema } from 'mongoose'
import { Collection } from '@/types/constants'
import { sanitizeSchema } from '@/services/sanitizeService'
import { customTransform } from '@/lib/utils'
import isEmail from 'validator/lib/isEmail'

/*
{
	"fname": "riajul",
	"lname": "islam",
	"phone": "+8801957500605",
	"email": "riajul@gmail.com",
	"subject": "inform you",
	"message": "testing messaging by contact up"
}
*/



const contactUsSchema = new Schema<ContactUsDocument>({
	isActive: {
		type: Boolean,
		default: false,
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
	subject: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	message: {
		type: String,
		lowercase: true,
		trim: true,
	},

}, {
	timestamps: true,
	toJSON: {
		virtuals: true, 										

		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})

contactUsSchema.plugin(sanitizeSchema)

contactUsSchema.virtual('fullName').get(function() {
	return `${this.fname} ${this.lname}`
})


const ContactUs = model<ContactUsDocument, Model<ContactUsDocument>>(Collection.ContactUs, contactUsSchema)
export default ContactUs

