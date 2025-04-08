import type { RequestHandler } from 'express'
import type { RequestBody } from '@/types/order'
import { isValidObjectId, Types } from 'mongoose'
import { appError, catchAsync } from '@/controllers/errorController'
import * as orderDtos from '@/dtos/orderDtos'
import { PaymentStatus, PaymentTypes } from '@/types/constants'
import Product from '@/models/productModel'
import { generateNMCode } from '@/lib/utils'
import Coupon from '@/models/couponModel'
import User from '@/models/userModel'
import ShippingInfo from '@/models/shippingInfoModel'
import BillingInfo from '@/models/billingInfoModel'
import * as fileService from '@/services/fileService'



export const formatOrderRequestBody: RequestHandler = catchAsync( async (req, res, next) => {
	const userId = req.session?.user.id
	if(!userId) return next(appError('You are not logedIn User'))


	// const snapshot: Snapshot = {
	// 	user: {},
	// 	billingInfo: {},
	// 	shippingInfo: {},
	// 	products: []
	// }

	// snapshot-step-1: User
	const user = await User.findById(userId).select('fname lname email phone')
	if(!user) return next(appError('no user found'))
	if(!user.phone) return next(appError('no user phone is missing'))

	const orderUser = {
		id: user._id.toString(),
		name: `${user.fname} ${user.lname}`,
		email: user.email,
		phone: user.phone,
	}

	const { 
		products: requestedProducts, 
		shippingCharge=0, 
		discount=0, 
		couponCode='', 
		shippingInfo, 
		billingInfo, 
		currency 
	}: RequestBody = req.body

	if( !isValidObjectId(shippingInfo) ) return next(appError('shippingInfo must be valid ObjectId'))
	if( !isValidObjectId(billingInfo) ) return next(appError('billingInfo must be valid ObjectId'))


	// snapshot-step-2: ShippingInfo
	const shippingInfoDoc = await ShippingInfo.findById(shippingInfo).select('street city country')
	if(!shippingInfoDoc) return next(appError('no shippingInfo found'))

	const orderShippingInfo = {
		id: shippingInfoDoc._id,
		street: shippingInfoDoc.street,
		city: shippingInfoDoc.city,
		country: shippingInfoDoc.country,
	}

	// snapshot-step-3: BillingInfo
	const billingInfoDoc = await BillingInfo.findById(billingInfo)
		.select('user phone email street')
		.populate({
			path: 'user',
			select: 'fname lname'
		})
	if(!billingInfoDoc) return next(appError('no billingInfo found'))
	if(!(billingInfoDoc.user as unknown as TempUser).fname) return next(appError('billingInfo user not found'))

	
	type TempUser = {
		fname: string
		lname: string
	}

	const orderBillingInfo = {
		id: billingInfoDoc._id,
		name: `
			${(billingInfoDoc.user as unknown as TempUser).fname} ${(billingInfoDoc.user as unknown as TempUser).lname}
		`,
		phone: billingInfoDoc.phone,
		email: billingInfoDoc.email,
		street: billingInfoDoc.street,
	}


	// const coupon = await Coupon.findOne({ code: couponCode })
	// if(!coupon)	return next(appError(`coupon not found by couponCode: ${couponCode}`, 404))

	const coupon = await Coupon.findOneAndUpdate({ code: couponCode }, { isUsed: true })
	if(!coupon)	return next(appError(`coupon update failed by couponCode: ${couponCode}`, 404))



	const couponDiscount = +coupon.discount || 0

  // Extract product IDs from the request body
	const productIds = requestedProducts.map( item => item.product )

  // Fetch products from the database
	const products = await Product.find({_id: { $in: productIds }})

	// Check if all products were found
	if (products.length !== productIds.length) {
		const foundProductIds = products.map(product => product._id.toString())
		const missingProductIds = productIds.filter(id => !foundProductIds.includes( id?.toString() ))
		return next(appError(`Products not found: ${missingProductIds.join(', ')}`, 404))
	}


	// Calculate total price
	let totalAmount = 0;
	requestedProducts.forEach(requestedProduct => {
		const product = products.find( product =>  product._id.toString() === requestedProduct.product.toString() )
		if (product) {
			totalAmount += product.price * (requestedProduct.quantity || 1)
		}
	})




	const productsPromise = products.map( (product) => {
		const filteredProduct = req.body.products.find( (bodyProduct: { product: string }) => product.id === bodyProduct.product)
		const	size = filteredProduct?.size
		if(!size) throw next(appError('size missing, which is mandatory')) 

		const	color = filteredProduct?.['color']
		if(!color) throw next(appError('color missing, which is mandatory')) 


		let thumbnail =	{}
		if(product.thumbnail?.secure_url) thumbnail = fileService.copyImage({ ...product.thumbnail }, '/upload/orders')


		return {
			id: product._id,
			name: product.name,
			skuCode: product.skuCode,
			description: product.description || 'no description',
			quantity: product.quantity || 1,
			price: product.price || 0,
			vat: product.vat || 0,
			tax: product.tax || 0,

			thumbnail: thumbnail,
			size,
			color,
		}

	})


	// const orderProducts: SnapshotProduct[] = []
	const orderProducts: any = await Promise.all(productsPromise)






	// Add shipping charge to the total price and removing discount
	totalAmount += shippingCharge - discount - couponDiscount
	// --------------------------------------------------


	const filteredBody = orderDtos.filterBodyForCreateOrder(req.body)

	// add fields to request
	filteredBody.transactionId = new Types.ObjectId().toHexString()
	filteredBody.nmCode = generateNMCode() + '.' + Date.now()				// => NM202503181.25465434165 	=> NMYYYYMMDDN
	filteredBody.couponCode = coupon.code 												
	filteredBody.paymentType = PaymentTypes.CASH_ON_DELIVERY
	filteredBody.status = PaymentStatus.PENDING
	filteredBody.totalAmount = totalAmount

	filteredBody.currency = currency
	filteredBody.discount = discount
	filteredBody.couponDiscount = couponDiscount
	filteredBody.shippingCharge = shippingCharge


	filteredBody.user = orderUser
	filteredBody.shippingInfo = orderShippingInfo
	filteredBody.billingInfo = orderBillingInfo
	filteredBody.products = orderProducts


	req.body = filteredBody

	next()
})