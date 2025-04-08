import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'



export type SubCategory = {
	name: string
	slug: string
	description: string
	isVisible: true
	icon?: Image
	thumbnail?: Image
	banner?: Image
}
export type SubCategoryDocument = Document & SubCategory & {
	category: Types.ObjectId
	user: Types.ObjectId
}

export type CreateSubCategory = SubCategory & {
	category: Types.ObjectId
	user: Types.ObjectId
}
export type UpdateSubCategory = SubCategory


export type SubCategoryModel = Model<SubCategoryDocument> & { }