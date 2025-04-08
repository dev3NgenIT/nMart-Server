import type { Document, Model, Types } from 'mongoose'

export type FaqQuestion = {
	user: Types.ObjectId
	name: string
	email: string
	message: string
}
export type FaqQuestionDocument = Document & FaqQuestion

export type CreateFaqQuestion = FaqQuestion
export type UpdateFaqQuestion = FaqQuestion

export type FaqQuestionModel = Model<FaqQuestionDocument> & { }