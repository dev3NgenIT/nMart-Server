import { Router } from 'express'
import * as subCategoryController from '@/controllers/subCategoryController'


// => /api/sub-categories
export const router = Router()


router.route('/')
	.get(subCategoryController.getSubCagegories)
	.post(subCategoryController.addSubCategory)

router.route('/many')
	.delete(subCategoryController.deletelSubCategoriesByIds)

router.route('/:subCategoryId')
	.get(subCategoryController.getSubCategoryByIdOrSlug)
	.patch(subCategoryController.updateSubCategoryByIdOrSlug)
	.delete(subCategoryController.deleteSubCategoryByIdOrSlug)
