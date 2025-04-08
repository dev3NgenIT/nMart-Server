import type { CouponDocument, CouponModel } from '@/types/coupon'
import type { Image } from '@/types/common'
import { Collection } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'
import bcryptjs from 'bcryptjs'


/*
{
	"type": "coupon type",
	"title": " coupon title 1",
	"description": "description-CODE",
	"code": "COUPON-CODE",
	"discount": "50",
	"quantity": 2,
	"isUsed": false,
	"isVisible": true,
	"startAt": "2025-02-12",
	"endDate": "2025-02-15",

	"rightBanner": "...",
	"banners": [
		"...",
	]
}
*/


const bannerSchema = new Schema<Image>({
	public_id: {
		type: String,
		required: true,
	},
	secure_url: {
		type: String,
		required: true,
	}
})
bannerSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
		const imageFields = ['banners']
		customTransform(ret, imageFields )
  },
})

const couponSchema = new Schema<CouponDocument>({
	name: {
		type: String,
		required: true,
		// lowercase: true,
		trim: true,
		minlength: 2,
		maxlength: 200,
	},
	description: {
		type: String,
		// required: true,
		// lowercase: true,
		trim: true,
		minlength: 2,
		// maxlength: 200,
	},
	code: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 2,
		maxlength: 100,
	},
	coupon: {
		type: String,
		select: false,
		required: true,
	},

	discount: {
		type: String,
		lowercase: true,
		trim: true,
		minlength: 0,
	},
	isUsed: {
		type: Boolean,
		default: false
	},
	isVisible: {
		type: Boolean,
		default: true
	},
	startDate: {
		type: Date,
		required: true,
	},
	endDate: {
		type: Date,
		required: true,
	},

	rightBanner: {
		public_id: String,
		secure_url: String,
	},
	banners: [bannerSchema],

}, {
	timestamps: true,
	toJSON: {

		transform(_doc, ret, _options) {
			const imageFields = ['banners', 'rightBanner'];
			customTransform(ret, imageFields )
		},
	}
})

couponSchema.pre('save', function (this:CouponDocument, next) {
	this.startDate = new Date( this.startDate )
	this.endDate = new Date( this.endDate )
	
	next()
})

couponSchema.pre('save', async function(this:CouponDocument, next) {
	if( !this.isModified('coupon') ) return

	this.coupon = await bcryptjs.hash(this.coupon, 12)
	next()
})

/* 	const coupon = await Coupon.findById( couponId )
		const isCouponVerified = await coupon.verifyCoupon( coupon.coupon ) */
couponSchema.methods.verifyCoupon = async function(this: CouponDocument, code: string ): Promise<boolean> {
	if( new Date(this.endDate) < new Date() ) return false

	return await bcryptjs.compare(code, this.coupon)
}

export const Coupon = model<CouponDocument, CouponModel>(Collection.Coupon, couponSchema)
export default Coupon


