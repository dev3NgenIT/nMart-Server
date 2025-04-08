import { Router } from 'express'
import * as faqQuestionController from '@/controllers/faqQuestionController'


// => /api/faq-questions
export const router = Router()


router.route('/')
	.get(faqQuestionController.getFaqQuestions)
	.post(faqQuestionController.addFaqQuestion)

router.route('/:faqQuestionId')
	.get(faqQuestionController.getFaqQuestionById)
	.patch(faqQuestionController.updateFaqQuestionById)
	.delete(faqQuestionController.deleteFaqQuestionById)
