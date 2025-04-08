import { Router } from 'express'
import * as productReviewLikeController from '@/controllers/productReviewLikeController'


// => /api/product-review-likes
export const router = Router({ mergeParams: true })


router.route('/')
	.get(productReviewLikeController.getProductReviewLikes)
	.post(productReviewLikeController.addProductReviewLike)

router.route('/:productReviewLikeId')
	.get(productReviewLikeController.getProductReviewLikesById)
	.patch(productReviewLikeController.updateProductReviewLikesById)
	.delete(productReviewLikeController.deleteProductReviewLikesById)
