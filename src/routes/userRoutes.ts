// import passport from 'passport'
import { Router } from 'express'
import * as userController from '@/controllers/userController'
import * as authController from '@/controllers/authController'
import { router as productRouter } from '@/routes/productRoutes'
import { router as reviewRouter } from '@/routes/reviewRoutes'
import { router as orderRouter } from '@/routes/orderRoutes'
import { router as productReviewLikeRouter } from '@/routes/productReviewLikeRoutes'


// => /api/users/
export const router = Router()

router.get('/me', authController.protect, userController.addUserId, userController.getUserById)
router.patch('/me', authController.protect, userController.addUserId, userController.updateUserById)
router.delete('/me', authController.protect, userController.addUserId, userController.deleteUserById)

// => POST /api/users/bulk-delete
router.post('/bulk-delete', authController.protect, userController.bulkDeleteUsers)

router.use('/:userId/products', productRouter)
router.use('/:userId/reviews', reviewRouter)
router.use('/:userId/orders', orderRouter)
router.use('/:userId/product-review-likes', productReviewLikeRouter)



router.route('/')
	.get(userController.getAllUsers)
	.post(authController.protect, authController.restrictTo('admin'), userController.createUserByAdminUser)
	// .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)

router.route('/:userId')
	.get(userController.getUserById)
	.patch(
		// authController.restrictTo('admin'),
		userController.updateUserById
	)
	.delete(userController.deleteUserById)
