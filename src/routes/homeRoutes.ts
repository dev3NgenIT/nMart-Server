import { Router } from 'express'
import * as homeController from '@/controllers/homeController'

export const router = Router({ mergeParams: true })


// => /api/homes
router.route('/')
	.get(homeController.getHomes)
	.post(homeController.addHome)

router.route('/:homeId')
	.get(homeController.getHomeById)
	.patch(homeController.updateHomeById)
	.delete(homeController.deleteHomeById)

router.route('/:homeId/change-active')
	.patch(homeController.changeActiveProperty)

