import type { Document, Types } from 'mongoose'
import type { Image, PaymentStatus, PaymentType } from './common'
import type { ShippingInfo } from '@/types/shippingInfo'
import type { BillingInfo } from '@/types/billingInfo'


type Currency = string

export type CashOnDeliveryProduct  = Document & {
	product: Types.ObjectId 											
	quantity: number
	color?: string
	size?: string
}

export type RequestBody  = {
	products: CashOnDeliveryProduct[]
	currency: Currency
	shippingCharge: number
	discount: number
	couponCode: string

	shippingInfo: ShippingInfo
	billingInfo?: BillingInfo
}



export type SnapshotUser = {
	id: Types.ObjectId
	name: string
	email: string
	phone: string
}
export type SnapshotShippingInfo = {
	id: Types.ObjectId
	street: string
	city: string
	country: string
}

export type SnapshotBillingInfo = {
	id: Types.ObjectId
	name: string
	phone: string
	email: string
	street: string
}
export type SnapshotProduct = {
	id: Types.ObjectId
	name: string
	skuCode: string
	thumbnail?: Image
	description: string
	quantity: number
	price: number

	vat: number
	tax: number

	color: string
	size: string
}

// export type Snapshot = {
// 	user: SnapshotUser
// 	shippingInfo: SnapshotShippingInfo
// 	billingInfo: SnapshotBillingInfo
// 	products: SnapshotProduct[]
// }


export type OrderDocument = Document & {
	nmCode: string

	user: SnapshotUser
	shippingInfo: SnapshotShippingInfo
	billingInfo: SnapshotBillingInfo
	products: SnapshotProduct[]


	transactionId: Types.ObjectId
	paymentType: PaymentType
	totalAmount: number

	currency: Currency
	status: PaymentStatus
	isPaid: boolean

	discount: number 
	shippingCharge: number 

	couponCode: string
	couponDiscount: number

	// required for sslCommerz
	tran_id?: string
	card_brand?: string
	card_type?: string
	currency_type?: string
	currency_amount?: string
	store_amount?: string
	tran_date?: string
}


