import { Router } from 'express'
import * as blogCategoryController from '@/controllers/blogCategoryController'


// => /api/blog-categories
export const router = Router()


router.route('/')
	.get(blogCategoryController.getBlogCagegories)
	.post(blogCategoryController.addBlogCategory)

router.route('/many')
	.delete(blogCategoryController.deletelBlogCategoriesByIds)

router.route('/:blogCategoryId')
	.get(blogCategoryController.getBlogCategoryByIdOrSlug)
	.patch(blogCategoryController.updateBlogCategoryByIdOrSlug)
	.delete(blogCategoryController.deleteBlogCategoryByIdOrSlug)
