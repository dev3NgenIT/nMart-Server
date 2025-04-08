import { Router } from 'express'
import * as authController from '@/controllers/authController'
import * as orderMiddleware from '@/middlewares/orderMiddleware'
import * as orderController from '@/controllers/orderController'


// => /api/orders2
export const router = Router({ mergeParams: true })


router.post('/cash-on-delivery', authController.protect, orderMiddleware.formatOrderRequestBody, orderController.cashOnDelivery)
router.patch('/cash-on-delivery/:orderId', authController.protect, orderController.updateCashOnDelivery)

router.post('/stripe-checkout', authController.protect,  orderMiddleware.formatOrderRequestBody, orderController.stripeCheckout)
router.get('/stripe-checkout/checkout-success/:transactionId',  orderController.stripeSuccessHandler )
router.get('/stripe-checkout/checkout-cancel/:transactionId',  orderController.stripeCancelHandler )
router.patch('/stripe-checkout/:orderId', authController.protect, orderController.updateCashOnDelivery)

router.post('/sslcommerz/checkout', authController.protect,  orderMiddleware.formatOrderRequestBody, orderController.sslCheckout)
router.post('/sslcommerz/checkout-success/:transactionId',  orderController.sslCheckoutSuccess)
router.post('/sslcommerz/checkout-cancel/:transactionId',  orderController.sslCheckoutCancel)
router.post('/sslcommerz/checkout-failed/:transactionId',  orderController.sslCheckoutFailed)
router.patch('/sslcommerz/checkout/:orderId', authController.protect, orderController.updateCashOnDelivery)

router.get('/orders-of-month',  orderController.getOrderOfMonth )


router.route('/')
	.get(authController.protect, orderController.getOrders)

router.route('/:orderId')
	.get(orderController.getOrderById)
	.patch(orderController.updateOrderById)
	.delete(orderController.deleteOrderById)
