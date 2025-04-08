import { Router } from 'express'
import * as blogController from '@/controllers/blogController'


// => /api/blogs
export const router = Router()


router.route('/')
	.get(blogController.getBlogs)
	.post(blogController.addBlog)

router.route('/:blogId')
	.get(blogController.getBlogByIdOrSlug)
	.patch(blogController.updateBlogByIdOrSlug)
	.delete(blogController.deleteBlogByIdOrSlug)
