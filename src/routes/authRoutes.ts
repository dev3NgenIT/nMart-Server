// import passport from 'passport'
import { Router } from 'express'
import * as authController from '@/controllers/authController'

// => /api/auth/
export const router = Router()

// router
// 	.post('/update-email', authController.protect, authController.sendUpdateEmailRequest)
// 	.get('/update-email/:resetToken', authController.protect, authController.updateEmail)


router
	.post('/register', authController.register)
	.post('/login', authController.login)
	.post('/logout', authController.protect, authController.logout)

	.post('/verify-request', authController.protect, authController.verifyRequest)
	.post('/verify-user', authController.verifyUser)

	.post('/forgot-password', authController.forgotPassword)
	.patch('/reset-password', authController.resetPassword)
	.patch('/update-password', authController.protect, authController.updatePassword)

	.get('/google', authController.googleLoginRequest)
	.get('/google/callback', authController.googleCallbackHandler)
	.get('/google/success/', authController.googleSuccessHandler)
	.get('/google/failure/', authController.googleAuthFailure)

	.get('/facebook', authController.facebookLoginRequest)
	.get('/facebook/callback', authController.facebookCallbackHandler)


