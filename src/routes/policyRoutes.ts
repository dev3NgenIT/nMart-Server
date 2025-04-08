import { Router } from 'express'
import * as policyController from '@/controllers/policyController'


// => /api/policies
export const router = Router()


router.route('/')
	.get(policyController.getPolicies)
	.post(policyController.addPolicy)

router.route('/:policyId')
	.get(policyController.getPolicyById)
	.patch(policyController.updatePolicyById)
	.delete(policyController.deletePolicyById)
