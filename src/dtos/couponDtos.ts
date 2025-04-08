import type { CouponDocument, CreateCoupon, UpdateCoupon } from '@/types/coupon'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	// 'type',
	'name',
	'description',
	// 'code',
	'discount',
	// 'quantity',
	'isUsed',
	'isVisible',
	'startDate',
	'endDate',

	'rightBanner',
	'banners',
]


// POST 	/api/coupons
export const filterBodyForCreateCoupon = (body: CreateCoupon) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// coupon => coupon._doc
export const filterCouponDocument = (body: CouponDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/coupons/:couponId
export const filterBodyForUpdateCoupon = (body: UpdateCoupon) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


