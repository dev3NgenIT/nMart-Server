import type { Types, Document, Model } from 'mongoose'
import type { Image } from '@/types/common'



export type Offer = {
	product: Types.ObjectId

	name: string
	slug: string
	buttonName?: string
	headerSlogan?: string

	isSelecte: boolean

	startDate: Date
	endDate: Date

	image?: Image
	thumbnail?: Image
	banner?: Image
	footerBanner?: Image
}
export type OfferDocument = Document & Offer

export type CreateOffer = Offer
export type UpdateOffer = Offer

export type OfferModel = Model<OfferDocument> & { }