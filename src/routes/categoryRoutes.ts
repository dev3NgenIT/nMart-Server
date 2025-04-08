import { Router } from 'express'
import * as categoryController from '@/controllers/categoryController'


// => /api/categories
export const router = Router()


router.route('/')
	.get(categoryController.getCagegories)
	.post(categoryController.addCategory)

router.route('/many')
	.delete(categoryController.deletelCategoriesByIds)

router.route('/:categoryId')
	.get(categoryController.getCategoryByIdOrSlug)
	.patch(categoryController.updateCategoryByIdOrSlug)
	.delete(categoryController.deleteCategoryByIdOrSlug)
