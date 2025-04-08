import type { Role } from '@/types/constants'
import type { User } from 'express'
import type { CookieSessionInterface, CookieSessionObject } from 'cookie-session'

type Auth = {
	authToken: string
	userId: string
}

declare global {
	namespace Express {


		// // // req.user?.id
		// interface User { 													// => Throw Error 
		// 	_id: string 														// MongoDB provide this proverty
		// 	id?: string 														// MongoDB provide this proverty
		// 	role?: string 													// Our custom property
		// }

	}
}


