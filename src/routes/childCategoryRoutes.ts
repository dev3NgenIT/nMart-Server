import { Router } from 'express'
import * as childCategoryController from '@/controllers/childCategoryController'


// => /api/child-categories
export const router = Router()


router.route('/')
	.get(childCategoryController.getChildCagegories)
	.post(childCategoryController.addChildCategory)

router.route('/:childCategoryId')
	.get(childCategoryController.getChildCategoryById)
	.patch(childCategoryController.updateChildCategoryById)
	.delete(childCategoryController.deleteChildCategoryById)
