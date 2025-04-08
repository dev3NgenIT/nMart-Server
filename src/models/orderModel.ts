import type { Model } from 'mongoose'
import type { OrderDocument } from '@/types/order'
import { Schema, model } from 'mongoose'
import { sanitizeSchema } from '@/services/sanitizeService'
import { Collection, PaymentStatus, PaymentTypes } from '@/types/constants'
import { customTransform } from '@/lib/utils'
import { SnapshotBillingInfo, SnapshotProduct, SnapshotShippingInfo, SnapshotUser } from '@/types/order'
import isEmail from 'validator/lib/isEmail'
import Product from './productModel'
import { appError } from '@/controllers/errorController'

/*
{

	"products": [
		{
			"id": "",
			"name": "",
			"skuCode": "",
			"thumbnail": "",
			"description": "",
			"quantity": 1,
			"price": "",
			"color": "",
			"size": "",
		},
	],

	"paymentType": "",
	"currency": "",
	"shippingCharge": 0,
	"discount": 0,
	"couponCode": "",


	"user": {
		"id": "",
		"name": "",
		"email": "",
		"phone": "",
	},
	"shippingInfo": {
		"id": "",
		"street": "",
		"city": "",
		"country": "",
	},
	"billingInfo": {
		"id": "",
		"name": "",
		"phone": "",
		"email": "",
		"street": "",
	},


	"nmCode": "asdfasdf",
	"transactionId": "asdfasdf",
	"totalAmount": 3200000,
	"status": "pading...",
	"isPaid": false,
	"couponDiscount": 0
}
*/

const orderUserSchema = new Schema<SnapshotUser>({
	id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		// minlength: 3,
		// maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: isEmail
	},
	phone: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 8,
	},
})

const orderShippingInfoSchema = new Schema<SnapshotShippingInfo>({
	id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	street: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	city: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	country: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
})

const orderBillingInfoSchema = new Schema<SnapshotBillingInfo>({
	id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	phone: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: isEmail
	},
	street: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
})


const orderProductSchema = new Schema<SnapshotProduct>({
	id: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	skuCode: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	quantity: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	vat: {
		type: Number,
		required: true
	},
	tax: {
		type: Number,
		required: true
	},

	color: {
		type: String,
		required: true
	},
	size: {
		type: String,
		required: true
	},

	thumbnail: {
		public_id: String,
		secure_url: String,
	},
}, {
	toJSON: {
		transform(_doc, ret, _options) {
			customTransform(ret, ['thumbnail'] )
		},
	}
})




// Create the Order schema
const orderSchema = new Schema<OrderDocument>({

	user: orderUserSchema,
	shippingInfo: orderShippingInfoSchema,
	billingInfo: orderBillingInfoSchema,
	products: [orderProductSchema],

	paymentType: { 																	// To identify transaction
		type: String,
		required: true,
		enum: Object.values(PaymentTypes), 						
	},

	nmCode: { 																				// => NM202503181 	=> NMYYYYMMDDN
		type: String,
		required: true,
		unique: true,
	},

	transactionId: { 																// To identify transaction
		type: Schema.Types.ObjectId,
		required: true
	},

	totalAmount: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		default: 'bdt'
	},

	status: {
		type: String,
		lowercase: true,
		trim: true,
		enum: Object.values(PaymentStatus), 						
		default: 'pending'
	},

	isPaid: {
		type: Boolean,
		default: false
	},

	shippingCharge: {
		type: Number,
		required: true
	},
	discount: {
		type: Number,
		default: 0
	},

	couponCode: {
		type: String,
		required: true,
	},
	couponDiscount: {
		type: Number,
		default: 0
	},
	// shippingInfo: shippingInfoSchema,

	// required for sslCommerz
	tran_id: String,
	tran_date: String,
	card_type: String,
	card_brand: String,
	currency_type: String,
	currency_amount: String,
	store_amount: String,

}, { timestamps: true })

orderSchema.set('toJSON', {
	transform(_doc, ret, _options) {

		const images = ['coverPhoto', 'thumbnail', 'images']
		customTransform(ret, images )
	},
})


orderSchema.plugin(sanitizeSchema)


// // POST-SAVE: Decrease stock
// orderSchema.post('save', async function (doc, next) {
//   try {
//     for (const item of doc.products) {
//       const product = await Product.findById(item.id);

//       if (!product) continue;

//       if (product.stock < item.quantity) {
// 				next(appError(`Stock underflow for product: ${product._id}`))
//         continue;
//       }

//       product.stock -= item.quantity;
//       await product.save();
//     }

//     next();
//   } catch (err) {
//     next(appError(`${JSON.stringify(err)}`));
//   }
// });



const Order = model<OrderDocument, Model<OrderDocument>>(Collection.Order, orderSchema);
export default Order
