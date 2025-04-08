import type { RequestHandler } from 'express'
import type { OrderDocument } from '@/types/order'
import type { ProductDocument } from '@/types/product'
import type { ResponseData } from '@/types/common'
import { Types } from 'mongoose'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/apiFeatures'
import { PaymentStatus, PaymentTypes } from '@/types/constants'
import { server, sslSecret, stripeScret } from '@/config'
import Order from '@/models/orderModel'

import * as orderDtos from '@/dtos/orderDtos'
import * as fileService from '@/services/fileService'

import Stripe from 'stripe'
// @ts-ignore
import sslcommerz from 'sslcommerz-lts'  		// ignore types for sslcommerz-lts library
import { promisify } from 'node:util'

const stripe = new Stripe(stripeScret.secretKey, { apiVersion: '2025-01-27.acacia' })


// SSLCommerz initialization
const sslcommerzInstance = new sslcommerz(sslSecret.storeId, sslSecret.storePassword, sslSecret.isLive) 




// GET 	/api/orders
// GET /api/users/:userId/orders
// GET /api/users/me/orders
export const getOrders: RequestHandler = catchAsync( async (req, res, _next) => {
	let userId = req.params.userId
	if (req.session?.userId && req.params.userId === 'me') userId = req.session?.userId

	let filter = {}
	if(userId) filter = { user: userId.toString() } 

	const { query, total } = await apiFeatures(Order, req.query, filter)
	const orders = await query
	
	// const orders = await query
	// 	.populate('billingInfo')
	// 	.populate('shippingInfo')
	// 	.populate('user')
	// 	.populate('products.product')
	// 	await User.populate(orders, 'billingInfo.user')

	const responseData: ResponseData<OrderDocument[]> = {
		status: 'success',
		total,
		count: orders.length,
		data: orders,
	}
	res.status(200).json(responseData)
})



// GET 	/api/orders/:orderId
export const getOrderById: RequestHandler = catchAsync( async (req, res, next) => {
	const orderId = req.params.orderId

	const order = await Order.findById(orderId)

	// const order = await Order.findById(orderId).populate( 'user shippingInfo billingInfo products.product')
	// await User.populate(order, 'billingInfo.user')

	if(!order) return next(appError('no order document found'))

	res.status(200).json({
		status: 'success',
		data: order
	})
})

// // => POST /api/orders/meny
// export const getOrdersByIds:RequestHandler = catchAsync( async (req, res, _next) => {
// 	const orderIds = req.body.orderIds || []
// 	const orders = await Order.find({_id: { $in: orderIds }})

// 	res.json({
// 		status: 'success',
// 		total: orders.length,
// 		data: orders,
// 	})
// })



// POST 	/api/orders/cash-on-delivery 	: comes from orderMiddleware
export const cashOnDelivery: RequestHandler = catchAsync( async (req, res, next) => {
	// ... orderMiddleware

	// const order = req.body
	const order = await Order.create(req.body)
	if(!order) return next(appError('order create failed'))

	const responseData: ResponseData<OrderDocument> = {
		status: 'success',
		data: order
	}
	res.status(201).json(responseData)
})

// PATCH 	/api/orders/cash-on-delivery/:orderId
export const updateCashOnDelivery: RequestHandler = catchAsync( async (req, res, next) => {
	const { orderId = ''} = req.params

	const order = await Order.findById(orderId)
	if(!order) return next(appError('order not found, please create order before try to update', 404))

	// Determine the next status based on the current status
	let nextStatus: string = ''
	if(order.status === PaymentStatus.PENDING) nextStatus = PaymentStatus.PROCESSING
	if(order.status === PaymentStatus.PROCESSING) nextStatus = PaymentStatus.SHIFTED
	if(order.status === PaymentStatus.SHIFTED) nextStatus = PaymentStatus.DELIVERED
	if(order.status === PaymentStatus.DELIVERED) return next(appError(`ordrId: ${orderId} is already DELIVERED`))

	if(!nextStatus) return next(appError(`status must be ${Object.values(PaymentStatus).join(' | ')}`))


	// const updatedOrder = await Order.findById(orderId)
	const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: nextStatus }, { new: true })
	if(!updatedOrder) return next(appError('update status failed'))

	res.status(201).json({
		status: 'success',
		data: updatedOrder
	})
})


// PATCH 	/api/orders/:orderId
export const updateOrderById: RequestHandler = catchAsync( async (req, res, next) => {
	const { orderId = ''} = req.params

	const updatedOther = await Order.findByIdAndUpdate(orderId, req.body, { new: true })
	if(!updatedOther) return next(appError('no order document update failed'))

	res.status(201).json({
		status: 'success',
		data: updatedOther
	})
})

// DELETE 	/api/orders/:orderId
export const deleteOrderById: RequestHandler = catchAsync( async (req, res, next) => {
	const orderId = req.params.orderId

	const order = await Order.findByIdAndDelete(orderId)
	if(!order) return next(appError('no order document deletation failed'))

	setTimeout(() => {
		order.products.forEach( (product) => {
			if(product.thumbnail) {
				promisify(fileService.removeFile)(product.thumbnail?.secure_url)
			}
		})
	}, 1000)

	res.status(200).json({
		status: 'success',
		data: order
	})
})


// POST /api/orders/stripe-checkout
export const stripeCheckout: RequestHandler = catchAsync(async (req, res, next) => {
    
	const requestedProducts  = req.body.products
	const products: ProductDocument[] = req.body.products
	const currency = req.body.currency
	const discount = req.body.discount
	const shippingCharge = req.body.shippingCharge
	const userId = req.body.user
	const totalAmount = req.body.totalAmount
	const shippingInfo = req.body.shippingInfo
	const billingInfo = req.body.billingInfo

	// Create line items for Stripe checkout
	const lineItems = products.map( (product, index) => ({
		quantity: requestedProducts[index].quantity,
		price_data: {
			currency: currency.toLowerCase(), 								// Ensure currency is in lowercase
			// unit_amount: product.price * 100, 							// Convert to cents
			unit_amount: Math.round((product.price - (discount / products.length)) * 100), 		// Adjust discount, because negitive value not allowed as lineItem
			product_data: {
				name: product.name, // Assuming `name` is included in `CashOnDeliveryProduct`
			},
		},
	}))

	// Add shipping charge as a separate line item
	if (shippingCharge) lineItems.push({
		quantity: 1,
		price_data: {
			currency: currency.toLowerCase(),
			unit_amount: shippingCharge * 100, // Convert to cents
			product_data: {
					name: 'Shipping Charge',
			},
		},
	})
	

	if (req.body.totalAmount < 40) return next(appError('Total amount must be at least 40 BDT'))
    
	const transactionId = new Types.ObjectId().toHexString()
	const success_url = `${server.origin}/api/orders/stripe-checkout/checkout-success/${transactionId}`
	const cancel_url = `${server.origin}/api/orders/stripe-checkout/checkout-cancel/${transactionId}`


	// Create Stripe checkout session
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		payment_method_types: ['card'],
		line_items: lineItems,
		success_url,
		cancel_url,
		metadata: {
			shippingInfo: JSON.stringify(shippingInfo),
			billingInfo: JSON.stringify(billingInfo || {}),
			discount: discount.toString(),
			shippingCharge: shippingCharge.toString(),
		},
	})

	if(!session?.id) return next(appError('session creation failed'))

	const filteredBody = orderDtos.filterBodyForCreateOrder(req.body)

	// add fields to request
	filteredBody.transactionId = transactionId
	filteredBody.paymentType = PaymentTypes.STRIPE
	filteredBody.user = userId
	filteredBody.status = PaymentStatus.PENDING
	filteredBody.totalAmount = totalAmount

	filteredBody.shippingInfo = shippingInfo
	filteredBody.billingInfo = billingInfo
	filteredBody.currency = currency
	filteredBody.shippingCharge = shippingCharge

	filteredBody.discount = discount
	// filteredBody.products = requestedProducts 					// auto comes from req.body.products = [ { product, quantity } ]

	const order = await Order.create(filteredBody)
	if(!order) return next(appError('order create failed'))

	const responseData: ResponseData = {
		status: 'success',
		message: 'use stripe url to pay via stripe',
		data: { url: session.url }
	}
	res.status(200).json(responseData)
})



// GET 		/api/orders/stripe-checkout/checkout-cancel/:transactionId
export const stripeCancelHandler: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if(!transactionId) return next(appError(`invalid route: ${transactionId}`))

	const order = await Order.findOneAndUpdate({ transactionId }, { status: PaymentStatus.CANCELLED }, { new: true })
	if(!order) return next(appError('payment entry not found'))
	
	const responseData: ResponseData = {
		status: 'fialed',
		message: 'order cancelled'
	}
	res.status(400).json(responseData)
})


// GET 		/api/orders/stripe-checkout/checkout-success/:transactionId
export const stripeSuccessHandler: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if(!transactionId) return next(appError(`invalid route: ${transactionId}`))

	const order = await Order.findOneAndUpdate({ transactionId }, { 
		status: PaymentStatus.PENDING,
		isPaid: true 
	}, { new: true })
	if(!order) return next(appError('order entry not found by transactionId'))
	
	const responseData: ResponseData<OrderDocument> = {
		status: 'success',
		message: 'stripe payment transaction successfull!!!',
		data: order,
	}
	res.status(200).json(responseData)
})


// PATCH 	/api/orders/cash-on-delivery/:orderId
// PATCH 	/api/orders/stripe-checkout/:orderId 			// handled by cash-on-delivery handler




// POST 	/api/orders/sslcommerz/checkout
export const sslCheckout: RequestHandler = catchAsync( async (req, res, next) => {
  // const { user: userId, products, totalAmount, currency='bdt', shippingInfo } = req.body

	// throw res.json(req.body)

	// const requestedProducts  = req.body.products
	// const products: ProductDocument[] = req.body.products
	// const discount = req.body.discount
	// const shippingCharge = req.body.shippingCharge
	const totalAmount = req.body.totalAmount

	const user = req.body.user 											// { id, name, email, phone }
	const shippingInfo = req.body.shippingInfo 			// { id, street, city, country }
	const billingInfo = req.body.billingInfo 				// { id, name, email, phone, street }


	const transactionId = req.body.transactionId

	const success_url = `${server.origin}/api/orders/sslcommerz/checkout-success/${transactionId}`
	const cancel_url = `${server.origin}/api/orders/sslcommerz/checkout-cancel/${transactionId}`
	const fail_url = `${server.origin}/api/orders/sslcommerz/checkout-failed/${transactionId}`
	const ipn_url = `${server.origin}/api/orders/sslcommerz/checkout-failed/${transactionId}`


	const transactionData = {
		total_amount: totalAmount,
		currency: req.body.currency.toUpperCase(),

		tran_id: transactionId,
		success_url,
		fail_url,
		cancel_url,
		ipn_url, 

		product_name: 'Multiple Products', // You can modify to include dynamic names
		product_category: 'Mixed',
		product_profile: 'general',

    cus_name: user.name,
    cus_email: user.email,
    cus_add1: shippingInfo.street,
    cus_phone: user.phone || '+8801957500605', 									// mandatory:
		cus_city: shippingInfo.city,
		cus_postcode: shippingInfo.postCode?.toString() || '4000',
		cus_country: shippingInfo.country,
		cus_state: shippingInfo.city,

		ship_name: user.name,
		shipping_method: 'courier',
		ship_add1: shippingInfo.street,
		ship_add2: billingInfo.street,
		ship_city: shippingInfo.city,
		ship_state: shippingInfo.city,
		ship_postcode: shippingInfo.postCode || 1212,
		ship_country: shippingInfo.country,
	}


	// Initiate the payment with SSLCommerz
	const response = await sslcommerzInstance.init(transactionData)
	if(response.status !== 'SUCCESS')  return next(appError(response.failedreason))
	

	const filteredBody = orderDtos.filterBodyForCreateOrder(req.body)

	// add fields to request
	filteredBody.transactionId = transactionId
	filteredBody.paymentType = PaymentTypes.SSLCOMMERZ
	filteredBody.status = PaymentStatus.PENDING
	filteredBody.totalAmount = totalAmount
	filteredBody.shippingCharge = req.body.shippingCharge
	filteredBody.discount = req.body.discount
	filteredBody.products = req.body.products

	filteredBody.shippingInfo = shippingInfo
	filteredBody.billingInfo = billingInfo
	filteredBody.user = req.body.user

	const order = await Order.create(filteredBody)
	if(!order) return next(appError('order create failed'))

	const responseData: ResponseData = {
		status: 'success',
		message: 'use sslCommerz url to pay via sslCommerz',
		data: { url: response.GatewayPageURL }
	}
	res.status(200).json(responseData)
})


// POST 	/api/orders/sslcommerz/checkout-success/:transactionId
export const sslCheckoutSuccess: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if(transactionId !== req.body.tran_id) return next(appError(`invalid route: ${transactionId}`))

	const order = await Order.findOneAndUpdate({ transactionId: req.body.tran_id }, {
 		status: PaymentStatus.PENDING, 
 		isPaid: true,

		tran_id: req.body.tran_id,
		card_brand: req.body.card_brand,
		card_type: req.body.card_type,
		currency_type: req.body.currency_type,
		currency_amount: req.body.currency_amount,
		store_amount: req.body.store_amount,
		tran_date: req.body.tran_date,
	}, { new: true })
	if(!order) return next(appError('payment entry not found'))


	const responseData: ResponseData<OrderDocument> = {
		status: 'success',
		message: 'sslcommerz payment transaction successfull!!!',
		data: order,
	}
	res.status(200).json(responseData)
})

// POST 	/api/orders/sslcommerz/checkout-cancel/:transactionId
export const sslCheckoutCancel: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if(transactionId !== req.body.tran_id) return next(appError(`invalid route: ${transactionId}`))

	const payment = await Order.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'cancelled' }, { new: true })
	if(!payment) return next(appError('payment entry not found'))
	
	res.status(400).json({
		status: 'error',
		data: req.body,
	})
	const responseData: ResponseData<OrderDocument> = {
		status: 'fialed',
		message: 'order cancelled'
		// data: order,
	}
	res.status(400).json(responseData)
})


// POST 	/api/orders/sslcommerz/checkout-failed/:transactionId
export const sslCheckoutFailed: RequestHandler = catchAsync( async (req, res, next) => {
	const { transactionId } = req.params
	if(transactionId !== req.body.tran_id) return next(appError(`invalid route: ${transactionId}`))

	const payment = await Order.findOneAndUpdate({ transactionId: req.body.tran_id }, { status: 'failed' }, { new: true })
	if(!payment) return next(appError('payment entry not found'))
	// update order.paymentStatus = 'error'
	
	res.status(400).json({
		status: 'error',
		data: req.body,
	})
})


// PATCH 	/api/orders/cash-on-delivery/:orderId
// PATCH 	/api/orders/stripe-checkout/:orderId 					// handled by cash-on-delivery handler
// PATCH 	/api/orders/sslcommerz/checkout/:orderId 			// handled by cash-on-delivery handler





// GET /api/orders/orders-of-month
export const getOrderOfMonth: RequestHandler = catchAsync(async (req, res, next) => {

  // Execute the aggregation pipeline using Order.aggregate()
  const monthlySales = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" }, 						// Group by month
        totalSales: { $sum: "$totalAmount" }, 		// Sum up the totalAmount for each month
        count: { $sum: 1 }, 											// Count the number of orders per month
      },
    },
    {
      $project: {
        _id: 0, 																	// Exclude the default _id field
        month: "$_id", 														// Rename _id to month
        totalSales: 1, 														// Include totalSales
        count: 1, 																// Include count
      },
    },
    {
      $sort: { month: 1 }, 												// Sort by month in ascending order
    },

	])

  if (!monthlySales || monthlySales.length === 0) return next(appError("No orders found for aggregation", 404))
  

	const responseData: ResponseData = {
		status: 'success',
    data: monthlySales,
	}
	res.status(200).json(responseData)
})