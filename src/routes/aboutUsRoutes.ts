import { Router } from 'express'
import * as aboutUsController from '@/controllers/aboutUsController'


// => /api/about-us
export const router = Router()


router.route('/')
	.get(aboutUsController.getAboutUs)
	.post(aboutUsController.addAboutUs)

router.route('/:aboutUsId')
	.get(aboutUsController.getAboutUsById)
	.patch(aboutUsController.updateAboutUsById)
	.delete(aboutUsController.deleteAboutUsById)

router.route('/:aboutUsId/change-active')
	.patch(aboutUsController.changeActiveProperty)