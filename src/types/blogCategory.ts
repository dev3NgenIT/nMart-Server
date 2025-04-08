import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'

/*
	"name": "Technology",
	"slug": "Technology",
	"title": "Latest Tech Trends & Innovations",
	"description": "Stay updated with the latest advancements in technology and gadgets."
	"isVisible": true,
	"image": "https://via.placeholder.com/300x200?text=Technology+Blog",
*/ 

export type BlogCategory = {
	user: Types.ObjectId
	name: string
	slug: string
	title: string
	description?: string
	isVisible: true
	image?: Image
}
export type BlogCategoryDocument = Document & BlogCategory

export type CreateBlogCategory = BlogCategory & { }
export type UpdateBlogCategory = BlogCategory



export type BlogCategoryModel = Model<BlogCategoryDocument> & { }