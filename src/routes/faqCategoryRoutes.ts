import { Router } from 'express'
import * as faqCategoryController from '@/controllers/faqCategoryController'


// => /api/faq-categories
export const router = Router()


router.route('/')
	.get(faqCategoryController.getFaqCategories)
	.post(faqCategoryController.addFaqCategory)

router.route('/:faqCategoryId')
	.get(faqCategoryController.getFaqCagegoryById)
	.patch(faqCategoryController.updateFaqCagegoryById)
	.delete(faqCategoryController.deleteFaqCagegoryById)
