import path from 'node:path'
import express from 'express'
import morgan from 'morgan'
import 'dotenv/config'

import cookieSession from 'cookie-session'
import passport from 'passport'
import cors from 'cors'
import routes from '@/routes'
import { passportConfig } from '@/controllers/passportConfig'
import * as errorController from '@/controllers/errorController'
import { listOfOrigins, NODE_ENV, SESSION_SECRET } from '@/config'



errorController.exceptionErrorHandler() 							// put it very top

const publicDirectory = path.join(process.cwd(), 'public')

if(!SESSION_SECRET) throw new Error(`Error: => SESSION_SECRET=${SESSION_SECRET}`)




export const app = express()

app.set('trust proxy', 1) 																	// Trust the proxy, which coming via Nginx
// app.set('query parser', 'simple') 												// To prevent default query query [] parser, which block apiFeatures: _filter[color]=blue functionality

app.use(express.static( publicDirectory ))
app.use(express.json({ limit: '400mb' }))
app.use(express.urlencoded({ limit: '400mb', extended: true }))


// middlewares
app.use(morgan('dev'))  	// => show dev request log
app.use(cors({ 																							// <= fetch(`${backendOrigin}/auth/login`, { credentials: 'include' })
	origin: NODE_ENV === 'production' ? true : listOfOrigins,	// 
	credentials: true
}))

// Step-1: set session
app.use(
  cookieSession({
    name: 'session',
    keys: [ SESSION_SECRET ], 

		signed: false, 																							// no need to encrypt, jwt is already encrypted
		// secure: NODE_ENV === 'production', 					
		// sameSite: NODE_ENV === 'production' ? 'none' : 'lax', 		// To send cookie with `sameSite='none'` secure must be true `secure: true`
    maxAge: 365 * 24 * 60 * 60 * 1000, 													// 1 year, and manage expiresIn via jwt only


		sameSite: 'lax', 																					// To send cookie link must be navigational: Ex. clicking a link or something
		secure: false, 					
  })
)

// Step-2: attach session with passport
app.use(passport.initialize())
app.use(passport.session())

// Step-3: passport.use(new LocalStrategy(...))
// Step-4: serializeUser + deserializeUser
passportConfig()

// Step-5: app passport.authenticate('local', {...}) 	on 	`POST /login` route




// Handle all Routes here
app.use(routes)

// handle errors
app.all('*', errorController.routeNotFound)
app.use(errorController.globalErrorHandler)
