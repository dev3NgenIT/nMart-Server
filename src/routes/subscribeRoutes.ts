import { Router } from 'express'
import * as subscribeController from '@/controllers/subscribeController'


// => /api/subscribes
export const router = Router()


router.route('/')
	.get(subscribeController.getSubscribes)
	.post(subscribeController.addSubscribe)

router.route('/:subscribeId')
	.get(subscribeController.getSubscribeById)
	.patch(subscribeController.updateSubscribeById)
	.delete(subscribeController.deleteSubscribeById)
