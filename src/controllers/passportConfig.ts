// used in app.js
import crypto from 'node:crypto'
import passport from 'passport'
import * as localStrategy from 'passport-local'
import bcryptjs from 'bcryptjs'
import { Strategy as OAuth2Strategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import { isEmail } from 'validator'
import User from '@/models/userModel'
import { appError } from '@/controllers/errorController'



export const passportConfig = () => {
	const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env || {}
	if( !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET ) throw new Error('google client or secret is missing') 

	const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = process.env || {}
	if( !FACEBOOK_CLIENT_ID || !FACEBOOK_CLIENT_SECRET ) throw new Error('facebook client or secret is missing') 


	passport.use(new localStrategy.Strategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true 					// now (username, password, done) => (req, email, password, done)
	}, async (_req, email, password, done) => {

		try {
			// const user = await User.findOne({ email }).select('+password')
			const filter = isEmail(email)  ? { email } : {}
			// const filter = isEmail(email)  ? { email } : { phone: email }
			const user = await User.findOne( filter ).select('+password')
			if(!user) return done(appError(`No user found with this ${email}`, 401, 'AuthError') , false )

			const isPasswordVarified = bcryptjs.compareSync( password, user.password )
			if(!isPasswordVarified) return done(appError(`wrong password`, 401, 'AuthError'), false )

			return done(null, user)

		} catch (err: unknown) {
			if(err instanceof Error) return done(appError(err.message, 401, 'AuthError'), false)
			if( typeof err === 'string') return done(appError(err, 401, 'AuthError'), false)
		}
	}))


	passport.use( new OAuth2Strategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: '/api/auth/google/callback', 					// same as origin-redirect: if request this route will show google login popup window
		scope: ['profile', 'email', 'openid'] 							// get these fields from google store
	}, async (_accessToken, _refreshToken, profile, done) => {

		const randomValue = `random-${Math.random() * 100000000}` 		
		let profileEmail = profile.emails && profile.emails.length ? profile.emails[0].value : `${randomValue}@.gmail.com`
		let profilePhoto = profile.photos && profile.photos.length ? profile.photos[0].value : '/upload/users/default.jpg'

		  const fullName = profile.displayName ?? profile.name ?? '';
			const [ fname, ...lastNameParts ] = fullName.split(' ');
			const lname = lastNameParts.join(' ')


		try {
			let user = await User.findOne({ clientId: profile.id })
			if(!user) {
				// use ramdom password so that schema validation pass

				user = await User.create({
					clientId: profile.id,
					// name: profile.displayName,
					fname,
					lname,
					username: randomValue,

					email: profileEmail,
					avatar: {
						public_id: crypto.randomUUID(),
						secure_url: profilePhoto,
					},
					// gender: 'google dose not provide gender so update it from user intpu later',
					password: randomValue,
					confirmPassword: randomValue,
				})
				if(!user) return done(appError('create user in database is failed', 401, 'AuthError'), false)
			}

			return done(null, user)

		} catch (err: unknown) {
			if(err instanceof Error) return done(appError(err.message, 401, 'AuthError'), false)
			if( typeof err === 'string') return done(appError(err, 401, 'AuthError'), false)
		}
	}))

	passport.use(new FacebookStrategy({
		clientID: FACEBOOK_CLIENT_ID,
		clientSecret: FACEBOOK_CLIENT_SECRET,
		callbackURL: '/api/auth/facebook/callback', 								// 
		scope: ['email', 'profile' ], 										
		// scope: ['email', 'public_profile' ], 										// while google store: ['email', 'profile' ],
		// profileFields: ['id', 'name', 'emails', 'photos'], 					// get these fields from facebook server
    // profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
	}, async (_accessToken, _refreshToken, profile, done) => {

		const randomValue = `random-${Math.random() * 100000000}` 		
		let profileEmail = profile.emails && profile.emails.length ? profile.emails[0].value : `${randomValue}@.gmail.com`
		let profilePhoto = profile.photos && profile.photos.length ? profile.photos[0].value : '/upload/users/default.jpg'

		const fullName = profile.displayName ?? profile.name ?? '';
		const [ fname, ...lastNameParts ] = fullName.split(' ');
		const lname = lastNameParts.join(' ')

		try {
			let user = await User.findOne({ clientId: profile.id })
			if(!user) {
				user = await User.create({
					clientId: profile.id,
					// name: profile.displayName,
					fname,
					lname,
					username: randomValue,

					email: profileEmail,
					avatar: {
						public_id: crypto.randomUUID(),
						secure_url: profilePhoto,
					},
					password: randomValue,
					confirmPassword: randomValue,
				})
				if(!user) return done(appError('create user in database is failed', 401, 'AuthError'), false)
			}

			return done(null, user)

		} catch (err: unknown) {
			if(err instanceof Error) return done(appError(err.message, 401, 'AuthError'), false)
			if( typeof err === 'string') return done(appError(err, 401, 'AuthError'), false)
		}
	}))


	passport.serializeUser((user: { id?: unknown }, done) => {
		done(null, user.id)
	})

	passport.deserializeUser( async (userId, done) => {
		try {
			const user = await User.findById(userId)
			if(!user) return done('user not find while deserializeUser' , false)
			// if(!user) return done(null, false, { message: 'user not find while deserializeUser' })

			done(null, user)

		} catch (err) {
			done(err)
		}
	})
}

