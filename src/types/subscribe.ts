import type { Types, Document, Model } from 'mongoose'

export type Subscribe = {
	user: Types.ObjectId
	email: string
}
export type SubscribeDocument = Document & Subscribe

export type CreateSubscribe = Subscribe
export type UpdateSubscribe = Subscribe

export type SubscribeModel = Model<SubscribeDocument> & { }