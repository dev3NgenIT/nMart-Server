import type { Document, Model } from 'mongoose'
import { Image } from '@/types/common'


export type Coupon = {
	// type: string
	name: string
	description: string
	code: string
	coupon: string
	discount: string
	// quantity: number 		// 0
	isUsed: boolean 		// false
	isVisible: boolean
	startDate: Date
	endDate: Date

	rightBanner: Image
	banners: Image[]


	verifyCoupon: (coupon: string) => Promise<boolean>
}
export type CouponDocument = Document & Coupon

export type CreateCoupon = Coupon
export type UpdateCoupon = Coupon


export type CouponModel = Model<CouponDocument> & { }



