import { Router } from 'express'
import { router as fileRouter } from '@/routes/fileRoutes' 
import { router as authRouter } from '@/routes/authRoutes' 
import { router as userRouter } from '@/routes/userRoutes' 
import { router as brandRouter } from '@/routes/brandRoutes' 
import { router as blogRouter } from '@/routes/blogRoutes' 
import { router as categoryRouter } from '@/routes/categoryRoutes' 
import { router as subCategoryRouter } from '@/routes/subCategoryRoutes' 
import { router as childCategoryRouter } from '@/routes/childCategoryRoutes' 
import { router as blogCategoryRouter } from '@/routes/blogCategoryRoutes' 
import { router as productRouter } from '@/routes/productRoutes' 
import { router as reviewRouter } from '@/routes/reviewRoutes' 
import { router as siteRouter } from '@/routes/siteRoutes' 
import { router as offerRouter } from '@/routes/offerRoutes' 
import { router as wishListRouter } from '@/routes/wishListRoutes' 
import { router as couponRouter } from '@/routes/couponRoutes' 
import { router as productReviewLikeRouter } from '@/routes/productReviewLikeRoutes' 

import { router as faqRouter } from '@/routes/faqRoutes' 
import { router as faqCategoryRouter } from '@/routes/faqCategoryRoutes' 
import { router as faqQuestionRouter } from '@/routes/faqQuestionRoutes' 

import { router as policyRouter } from '@/routes/policyRoutes' 
import { router as homeRouter } from '@/routes/homeRoutes' 
import { router as subscribeRouter } from '@/routes/subscribeRoutes' 

import { router as aboutUsRouter } from '@/routes/aboutUsRoutes' 
import { router as contactUsRouter } from '@/routes/contactUsRoutes' 

import { router as shippingInfoRouter } from '@/routes/shippingInfoRoutes' 
import { router as billingInfoRouter } from '@/routes/billingInfoRoutes' 
import { router as orderRouter } from '@/routes/orderRoutes' 


// => / 	(root)
const router = Router()

router.use('/upload', fileRouter)
router.use('/api/auth', authRouter)
router.use('/api/users', userRouter)

router.use('/api/brands', brandRouter)
router.use('/api/blogs', blogRouter)
router.use('/api/categories', categoryRouter)
router.use('/api/sub-categories', subCategoryRouter)
router.use('/api/child-categories', childCategoryRouter)
router.use('/api/blog-categories', blogCategoryRouter)

router.use('/api/products', productRouter)
router.use('/api/reviews', reviewRouter)
router.use('/api/sites', siteRouter)
router.use('/api/offers', offerRouter)

router.use('/api/faqs', faqRouter)
router.use('/api/faq-categories', faqCategoryRouter)
router.use('/api/faq-questions', faqQuestionRouter)
router.use('/api/policies', policyRouter)

// extrans
router.use('/api/wishlists', wishListRouter)
router.use('/api/coupons', couponRouter)
router.use('/api/product-review-likes', productReviewLikeRouter)
router.use('/api/homes', homeRouter)
router.use('/api/subscribes', subscribeRouter)

router.use('/api/about-us', aboutUsRouter)
router.use('/api/contact-us', contactUsRouter)

router.use('/api/shipping-info', shippingInfoRouter)
router.use('/api/billing-info', billingInfoRouter)
router.use('/api/orders', orderRouter)

export default router
