import { customTransform } from '@/lib/utils'
import type { BlogCategoryDocument, BlogCategoryModel } from '@/types/blogCategory'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import slugify from 'slugify'


/*
{
  "user": "67986c8660c5024225bf3e76",

	"name": "Technology",
	"slug": "Technology",
	"title": "Latest Tech Trends & Innovations",
	"description": "Stay updated with the latest advancements in technology and gadgets."
	"isVisible": true,
	"image": "https://via.placeholder.com/300x200?text=Technology+Blog",
}
*/




const blogCategorySchema = new Schema<BlogCategoryDocument>({
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
	title: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 500,
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

	image: {
		public_id: String,
		secure_url: String,
	},

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['image']
			customTransform(ret, imageFields )
		},
	}
})

blogCategorySchema.pre('save', function(next) {

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})
export const BlogCategory = model<BlogCategoryDocument, BlogCategoryModel>(Collection.BlogCategory, blogCategorySchema)
export default BlogCategory