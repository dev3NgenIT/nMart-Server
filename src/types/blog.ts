import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'

export type Blogs = {
	name: string
	slug: string
	summary: string
	content: string 				// content

	isVisible: boolean 			// true
	// isFeatured: boolean 		// false

  additionalUrl?: string
	banner?: Image

	tags: string[]

	// header?: string
	// address?: string
	// footer?: string
  // badge: string
	// type?: string
	// logo?: Image
	// thumbnail?: Image
}
export type BlogDocument = Document & Blogs & {
	category: Types.ObjectId
	author: Types.ObjectId
}

export type CreateBlog = Blogs & {
	category: Types.ObjectId
	author: Types.ObjectId
}

export type UpdateBlog = Blogs



export type BlogModel = Model<BlogDocument> & { }