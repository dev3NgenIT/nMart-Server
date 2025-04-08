import { Router } from 'express'
import * as shippingInfoController from '@/controllers/shippingInfoController'


// => /api/shipping-info
export const router = Router()


router.route('/')
	.get(shippingInfoController.getShippingInfos)
	.post(shippingInfoController.addShippingInfo)

router.route('/:shippingInfoId')
	.get(shippingInfoController.getShippingInfoById)
	.patch(shippingInfoController.updateShippingInfoById)
	.delete(shippingInfoController.deleteShippingInfoById)
