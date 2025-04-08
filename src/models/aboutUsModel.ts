import type { Model } from 'mongoose'
import type { AboutUsDocument } from '@/types/aboutUs'
import type { Image } from '@/types/common'
import { model, Schema } from 'mongoose'
import { Collection } from '@/types/constants'
import { sanitizeSchema } from '@/services/sanitizeService'
import { customTransform } from '@/lib/utils'

/*
{

	"header": "About Us"
	"slogan": "Discover our Story, Mission and Value"

	"topBanner": Image

	"column1Badge": "Our Service"
	"column1Title": "We offer fast and secure home delivery services."
	"column1Description": "At Welcome to [Your eCommerce Website Name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets,home essentials, etc.]. Founded on the principles of quality, affordability, and customer satisfaction, we are committed to ."
	"column1Image": string

	"column2Badge": "Why choose Us"
	"column2Title": "We offer fast and secure..",
	"column2Description": "At Welcome to [Your eCommerce Website Name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets, home essentials, etc.]. Founded on the principles of quality, affordability, and customer satisfaction, we are committed to delivering an exceptional shopping experience for everyone."

	"column3Badge": "What we offer"
	"column3Title": "We offer fast and secure home delivery services."
	"column3Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	"column3Image": string

  
}
*/



const aboutUsSchema = new Schema<AboutUsDocument>({
	isActive: {
		type: Boolean,
		default: false,
	},

	header: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	slogan: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},

	column1Badge: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column1Title: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column1Description: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},

	column2Badge: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column2Title: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column2Description: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},


	column3Badge: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column3Title: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},
	column3Description: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 0,
	},


	topBanner: {
		public_id: String,
		secure_url: String,
	},
	column1Image: {
		public_id: String,
		secure_url: String,
	},
	column3Image: {
		public_id: String,
		secure_url: String,
	},


}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['topBanner', 'column1Image', 'column3Image']
			customTransform(ret, imageFields )
		},
	}
})


aboutUsSchema.plugin(sanitizeSchema)

const AboutUs = model<AboutUsDocument, Model<AboutUsDocument>>(Collection.AboutUs, aboutUsSchema)
export default AboutUs

