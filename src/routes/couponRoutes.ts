import { Router } from 'express'
import * as couponController from '@/controllers/couponController'


// => /api/coupons
export const router = Router()


router.get('/:couponCode/verify', couponController.verifyCouponByCode)

router.route('/')
	.get(couponController.getCoupons)
	.post(couponController.addCoupon)

router.route('/:couponId')
	.get(couponController.getCouponByIdOrCouponCode)
	.patch(couponController.updateCouponById)
	.delete(couponController.deleteCouponById)
