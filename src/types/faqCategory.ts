import type { Document, Model } from 'mongoose'

export type FaqCategory = {
	name: string
}
export type FaqCategoryDocument = Document & FaqCategory

export type CreateFaq = FaqCategory
export type UpdateFaq = FaqCategory

export type FaqCategoryModel = Model<FaqCategoryDocument> & { }