import { Router } from 'express'
import * as reviewController from '@/controllers/reviewController'
import { router as productReviewLikeRouter } from '@/routes/productReviewLikeRoutes'


// => /api/reviews
// => /api/users/:userId/reviews/
// => /api/products/:productId/reviews/

export const router = Router({ mergeParams: true })

router.use('/:reviewId/product-review-likes', productReviewLikeRouter)

router.route('/')
	.get(reviewController.getReviews)
	.post(reviewController.addReview)

router.route('/:reviewId')
	.get(reviewController.getReviewById)
	.patch(reviewController.updateReviewById)
	.delete(reviewController.deleteReviewById)
