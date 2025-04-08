import { Router } from 'express'
import { router as reviewRouter } from '@/routes/reviewRoutes'
import { router as productReviewLikeRouter } from '@/routes/productReviewLikeRoutes'
import * as productController from '@/controllers/productController'
import * as authController from '@/controllers/authController'
// import * as userController from '@/controllers/userController'

export const router = Router({ mergeParams: true })



router.use('/:productId/reviews', reviewRouter)
router.use('/:productId/product-review-likes', productReviewLikeRouter)

router.route('/random-products').get(productController.getRandomProducts)
router.route('/popular-products').get(productController.getPopularProducts)

router.route('/popular-productss').get(productController.getPopularProducts)
router.route('/un-reviewed-products').get(
	authController.protect,
	// userController.addUserId,
	productController.getUnReviewedProductsFromOrder
)


// => /api/products
router.route('/')
	.get(productController.getProducts)
	.post(productController.addProduct)

router.route('/many')
	.delete(productController.deletelProductsByIds)

router.route('/:productId')
	.get(productController.getProductByIdOrSlug)
	.patch(productController.updateProductByIdOrSlug)
	.delete(productController.deleteProductByIdOrSlug)


