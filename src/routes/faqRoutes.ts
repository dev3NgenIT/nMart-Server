import { Router } from 'express'
import * as faqController from '@/controllers/faqController'


// => /api/faqs
export const router = Router()


router.route('/')
	.get(faqController.getFaqs)
	.post(faqController.addFaq)

router.route('/:faqId')
	.get(faqController.getFaqById)
	.patch(faqController.updateFaqById)
	.delete(faqController.deleteFaqById)
