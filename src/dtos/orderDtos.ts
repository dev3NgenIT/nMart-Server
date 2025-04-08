import { filterObjectByArray } from '@/lib/utils'
import type { OrderDocument } from '@/types/order'

const commonFields = [
	// 'transactionId', 	// will be generated from backend
	// 'paymentType',
	// 'user',
	// 'status', 						
	// 'isPaid', 						
	'nmCode',  						// => NM202503181 	=> NMYYYYMMDDN
	'couponCode',

	'products',
	'currency',
	'shippingInfo',

	'discount', 						

	// for sslCommerz
	'tran_id',
	'tran_date',
	'card_type',
	'card_brand',
	'currency_type',
	'currency_amount',
	'store_amount',
]

// POST 	/api/orders
export const filterBodyForCreateOrder = (body: OrderDocument) => {
	const allowedFields = commonFields

	return filterObjectByArray(body, allowedFields)
}

// order => order._doc
export const filterOrderDocument = (body: OrderDocument) => {
	const allowedFields = [
		...commonFields,
		'totalAmount',

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/orders/:orderId
export const filterBodyForUpdateOrder = (body: OrderDocument) => {

	const allowedFields = [
		...commonFields
	]
	return filterObjectByArray(body, allowedFields)
}


