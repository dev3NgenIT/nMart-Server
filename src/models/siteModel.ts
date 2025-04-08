import type { SiteDocument, SiteModel } from '@/types/site'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { sanitizeSchema } from '@/services/sanitizeService'
import slugify from 'slugify'
import { customTransform } from '@/lib/utils'


/*
{

	"updateBy": "67986c8660c5024225bf3e76",

	"siteMotto": "sites moto",
	"siteUrl": "site url",
	"salesEmail": "salesEmail",
	"primaryPhone": "primaryPhone",
	"alternativePhone": "alternativePhone",
	"googleAnalytics": "googleAnalytics",
	"googleAbsense": "googleAbsense",
	"maintenanceMode": false,
	"companyName": "NGen IT",
	"socialMediaLinks": {
		"website": "https://ngenitltd.com",
		"facebook": "facebook",
		"instagram": "instagram",
		"linkedIn": "linkedIn",
		"whatsApp": "whatsApp",
		"twitter": "twitter",
		"youTube": "youTube",
		"reddit": "reddit",
		"tumblr": "tumblr",
		"tiktok": "tiktok",
	}


	"name" 					: "N-Mart",
	"phoneOne" 			: "+1-800-123-4567",
	"phoneTwo" 			: "+1-800-987-6543",
	"whatsappNumber": "+1-800-555-7890",
	"contactEmail" 	: "contact@nmart.com",
	"supportEmail" 	: "support@nmart.com",
	"infoEmail" 		: "info@nmart.com",
	"about" 				: "Example Store is your go-to destination for high-quality experience with exceptional customer service.",
	"addressOne" 		: "123 Main Street",
	"addressTwo" 		: "Suite 400, Cityville, CA 90210",

	"defaultLanguage": "en",
	"defaultCurrency": "USD",
	"copyrightUrl" 	: "https://www.example.com",
	"copyrightTitle": "© 2024 Example Store. All Rights Reserved.",

	"metaKeyword" 	: "ecommerce, online store, best deals, shopping",
	"metaDescription": "Welcome to Example Store, your go-to destination for the best products at unbeatable prices."

	"favicon" 			: "https://via.placeholder.com/100x100?text=Site+Icon",
	"systemLogoWhite": "https://via.placeholder.com/300x100?text=System+Logo+White",
	"systemLogoBlack": "https://via.placeholder.com/300x100?text=System+Logo+Black",
	"metaImage" 		: "https://via.placeholder.com/300x300?text=Meta+Image"
}

*/




const siteSchema = new Schema<SiteDocument>({
	isActive: {
		type: Boolean,
		default: false,
	},

	updateBy: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true
	},

	siteMotto: {
		type: String,
		trim: true,
		lowercase: true,
	},
	siteUrl: {
		type: String,
		trim: true,
		lowercase: true,
	},
	salesEmail: {
		type: String,
		trim: true,
		lowercase: true,
		// validate:
	},
	primaryPhone: {
		type: String,
		trim: true,
		lowercase: true,
	},
	alternativePhone: {
		type: String,
		trim: true,
		lowercase: true,
	},
	googleAnalytics: {
		type: String,
		trim: true,
		lowercase: true,
	},
	googleAbsense: {
		type: String,
		trim: true,
		lowercase: true,
	},
	companyName: {
		type: String,
		trim: true,
		lowercase: true,
	},

	maintenanceMode: Boolean,
	// systemTimezone: string 		// text like 'UTC', 'EST', etc valueeee, select option
	socialMediaLinks: {
		website: String,
		facebook: String,
		instagram: String,
		linkedIn: String,
		whatsApp: String,
		twitter: String,
		youTube: String,
		reddit: String,
		tumblr: String,
		tiktok: String,
	},



	name: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		// lowercase: true,
	},
	slug: { 							// create from name property via pre('save') hook 
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		default: '',
		set: function (slug: string) { return slugify(slug, { lower: true }) }
	},

	phoneOne: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	phoneTwo: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	whatsappNumber: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	infoEmail: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	contactEmail: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	supportEmail: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	about: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	addressOne: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	addressTwo: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	defaultCurrency: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	defaultLanguage: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	copyrightUrl: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	copyrightTitle: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	metaKeyword: { 
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	metaDescription: { 
		type: String,
		trim: true,
		// lowercase: true,
		default: '',
	},


	favicon: {
		public_id: String,
		secure_url: String,
	},
	systemLogoWhite: {
		public_id: String,
		secure_url: String,
	},
	systemLogoBlack: {
		public_id: String,
		secure_url: String,
	},
	metaImage: {
		public_id: String,
		secure_url: String,
	},

	// // page: contactUs
	// contactUsTitle: String,
	// contactUsDescription: String,
	// contactUsPhone: String,
	// contactUsEmail: String,
	// contactUsAddress: String,

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['metaImage']
			customTransform(ret, imageFields )
		},
	}
})

siteSchema.plugin(sanitizeSchema)
siteSchema.pre('save', function(next) {

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})
export const Site = model<SiteDocument, SiteModel>(Collection.Site, siteSchema)
export default Site