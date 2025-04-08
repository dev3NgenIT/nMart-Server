import type { BlogDocument, BlogModel } from '@/types/blog'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { sanitizeSchema } from '@/services/sanitizeService'
import slugify from 'slugify'
import { customTransform } from '@/lib/utils'


/*
{
  "category": "67986d3d60c5024225bf3e81",
  "author": "67986c8660c5024225bf3e76",

  "name": "The Future of AI in Everyday Life 3",
  "slug": "The Future-of-AI-in-Everyday-Life 3",
  "summary": "Artificial Intelligence is revolutionizing industries and daily life.",
  "content": "AI technology is growing rapidly, influencing businesses, healthcare, and consumer applications...",
  "isVisible": true,

  "additionalUrl": "https://example.com/tech-blog",
  "banner": "https://via.placeholder.com/600x200?text=Banner",
}

*/




const blogSchema = new Schema<BlogDocument>({
	author: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true
	},
	category: { 																						// category => blogCategory
		type: Schema.Types.ObjectId,
		ref: Collection.Category,
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
	summary: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 250,
	},

	content: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		// maxlength: 1000,
	},
	isVisible: {
		type: Boolean,
		default: true
	},
	additionalUrl: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 300,
	},
	banner: {
		public_id: String,
		secure_url: String,
	},

	tags: [{
		type: String,
		trim: true,
		lowercase: true,
		minlength: 2,
	}],

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = ['banner']
			customTransform(ret, imageFields )
		},
	}
})

blogSchema.plugin(sanitizeSchema)
blogSchema.pre('save', function(next) {

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})
export const Blog = model<BlogDocument, BlogModel>(Collection.Blog, blogSchema)
export default Blog