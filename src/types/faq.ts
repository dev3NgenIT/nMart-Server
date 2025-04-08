import type { Document, Model } from 'mongoose'

export type Faq = {
	category: string
	question: string
	answer: string
	listOrder: number

	isVisible: boolean
}
export type FaqDocument = Document & Faq

export type CreateFaq = Faq
export type UpdateFaq = Faq

export type FaqModel = Model<FaqDocument> & { }