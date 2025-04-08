import { Router } from 'express'
import * as contactUsController from '@/controllers/contactUsController'


// => /api/contact-us
export const router = Router()


router.route('/')
	.get(contactUsController.getContactUs)
	.post(contactUsController.addContactUs)

router.route('/:contactUsId')
	.get(contactUsController.getContactUsById)
	.patch(contactUsController.updateContactUsById)
	.delete(contactUsController.deleteContactUsById)

router.route('/:contactUsId/change-active')
	.patch(contactUsController.changeActiveProperty)