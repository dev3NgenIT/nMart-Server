import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'


export type ChildCategory = {
	name: string
	slug: string
	description: string
	isVisible: true
	icon?: Image
	thumbnail?: Image
	banner?: Image
}
export type ChildCategoryDocument = Document & ChildCategory & {
	subCategory: Types.ObjectId
	user: Types.ObjectId
}


export type CreateChildCategory = ChildCategory & {
	subCategory: Types.ObjectId
	user: Types.ObjectId
}
export type UpdateChildCategory = ChildCategory


export type ChildCategoryModel = Model<ChildCategoryDocument> & { }