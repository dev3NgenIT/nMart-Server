import type { Types, Document, Model } from 'mongoose'



export type BillingInfo = {
	user: Types.ObjectId

	phone: string
	email: string
	street: string
	country: string
	city: string
	region: string
	postCode: string
}
export type BillingInfoDocument = Document & BillingInfo

export type CreateBillingInfo = BillingInfo
export type UpdateBillingInfo = BillingInfo

export type BillingInfoModel = Model<BillingInfoDocument> & { }