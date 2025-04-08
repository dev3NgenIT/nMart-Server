import type { BrandDocument, BrandModel } from '@/types/brand'
import { customTransform } from '@/lib/utils'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import slugify from 'slugify'


/*
{
	"name" : "Category 1",
	"banner": "/images/brand1-banner.png",
	"description": "Brand 1 is known for its excellence in Category A.",
	"isVisible": true

	"image" : "data:....",
	"logo": "https://img.daisyui.com/images/profile/demo/2@94.webp",
	"thumbnail": "/images/brand1-thumbnail.png",
	"banner": "/images/brand1-banner.png",
	or
	"image" : "http://:....",
}

  {
    "id": 1,
    "name": "Brand 1",
    "image": "https://img.daisyui.com/images/profile/demo/2@94.webp",
    "logo": "https://img.daisyui.com/images/profile/demo/2@94.webp",
    "thumbnail": "/images/brand1-thumbnail.png",
    "banner": "/images/brand1-banner.png",
    "description": "Brand 1 is known for its excellence in Category A.",
    "isVisible": true
  },
  {
    "id": 2,
    "name": "Brand 2",
    "image": "https://img.daisyui.com/images/profile/demo/2@94.webp",
    "logo": "https://img.daisyui.com/images/profile/demo/2@94.webp",
    "thumbnail": "/images/brand2-thumbnail.png",
    "banner": "/images/brand2-banner.png",
    "description": "Brand 2 offers a wide range of products in Category B.",
    "isVisible": false
  },
*/




const brandSchema = new Schema<BrandDocument>({
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
	description: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},
	isVisible: {
		type: Boolean,
		default: true
	},

	logo: {
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

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['logo', 'thumbnail', 'banner'];
			customTransform(ret, imageFields )
		},
	}
})

brandSchema.pre('save', function(next) {

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})
export const Brand = model<BrandDocument, BrandModel>(Collection.Brand, brandSchema)
export default Brand