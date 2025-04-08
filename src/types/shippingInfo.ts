import type { Types, Document, Model } from 'mongoose'



export type ShippingInfo = {
	user: Types.ObjectId

	fname: string
	lname: string
	phone: string
	email: string
	street: string
	postCode: string
	region: string
	city: string
	country: string
}
export type ShippingInfoDocument = Document & ShippingInfo

export type CreateShippingInfo = ShippingInfo
export type UpdateShippingInfo = ShippingInfo

export type ShippingInfoModel = Model<ShippingInfoDocument> & { }