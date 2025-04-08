import { Router } from 'express'
import * as billingInfoController from '@/controllers/billingInfoController'


// => /api/shipping-info
export const router = Router()


router.route('/')
	.get(billingInfoController.getBillingInfos)
	.post(billingInfoController.addBillingInfo)

router.route('/:billingInfoId')
	.get(billingInfoController.getBillingInfoById)
	.patch(billingInfoController.updateBillingInfoById)
	.delete(billingInfoController.deleteBillingInfoById)
