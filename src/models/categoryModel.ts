import { customTransform } from '@/lib/utils'
import type { CategoryDocument, CategoryModel } from '@/types/category'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import slugify from 'slugify'


/*
{
  "user": "67986c8660c5024225bf3e76",
  "name": "Electronics",
  "description": "Find the latest and greatest in electronics, from smartphones to smart home devices.",
  "isVisible": true,
  "icon": "https://via.placeholder.com/50x50?text=Electronics",
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
  "banner": "https://via.placeholder.com/600x200?text=Electronics+Banner"
}
*/




const categorySchema = new Schema<CategoryDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		// required: true
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
	description: {
		type: String,
		// required: true,
		trim: true,
		// lowercase: true,
		minlength: 3,
		maxlength: 500,
	},
	isVisible: {
		type: Boolean,
		default: true
	},
	isCategoryShownOnFrontend: {
		type: Boolean,
		default: false
	},

	icon: {
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
			const imageFields = ['icon', 'thumbnail', 'banner']
			customTransform(ret, imageFields )
		},
	}
})

categorySchema.pre('save', function(next) {

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})

export const Category = model<CategoryDocument, CategoryModel>(Collection.Category, categorySchema)
export default Category