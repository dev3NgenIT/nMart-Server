import type { OfferDocument, OfferModel } from '@/types/offer'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import slugify from 'slugify'
import { customTransform } from '@/lib/utils'


/*
{
	"product": "67986d5360c5024225bf3e83",
	"name": "Limited Time Offer",
	"buttonName": "Buy Now",
	"isSelecte": false,
	"headerSlogan": "Get the best deal on Smartphone X!",

	"startDate": "2024-02-05",
	"endDate": "2024-02-20",

	"image": "https://via.placeholder.com/300x300?text=Product+Image",
	"thumbnail": "https://via.placeholder.com/100x100?text=Thumbnail",
	"banner": "https://via.placeholder.com/600x200?text=Banner",
	"footerBanner": "https://via.placeholder.com/600x100?text=Footer+Banner"
}
*/




const offerSchema = new Schema<OfferDocument>({
	product: {
		type: Schema.Types.ObjectId,
		ref: Collection.Product,
		required: true
	},

	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},
	slug: { 							// create from name property via pre('save') hook 
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		default: '',
		set: function (slug: string) { return slugify(slug, { lower: true }) }
	},
	buttonName: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 2,
		maxlength: 50,
	},

	headerSlogan: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 2,
		maxlength: 500,
	},

	isSelecte: {
		type: Boolean,
		default: false
	},

	startDate: Date,
	endDate: Date,

	image: {
		public_id: String,
		secure_url: String,
	},
	thumbnail: {
		public_id: String,
		secure_url: String,
	},
	banner: {
		public_id: String,
		secure_url: String,
	},
	footerBanner: {
		public_id: String,
		secure_url: String,
	},

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['image', 'thumbnail', 'banner', 'footerBanner']
			customTransform(ret, imageFields )
		},
	}
})

offerSchema.pre('save', function(this: OfferDocument, next) {
	this.startDate = new Date( this.startDate )
	this.endDate = new Date( this.endDate )

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})
export const Offer = model<OfferDocument, OfferModel>(Collection.Offer, offerSchema)
export default Offer