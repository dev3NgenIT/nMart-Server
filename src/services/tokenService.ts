import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'
import jwt from 'jsonwebtoken'


const { JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env


if(!JWT_AUTH_TOKEN_SECRET || !JWT_EXPIRES_IN) throw new Error(`${JWT_AUTH_TOKEN_SECRET}`)

export const generateTokenForUser = async (id: string): Promise<string> => {
	return jwt.sign({ id }, JWT_AUTH_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN })
}
export const verifyUserAuthToken = async (authToken: string): Promise<JwtPayload> => {
	return jwt.verify(authToken, JWT_AUTH_TOKEN_SECRET) as JwtPayload
}

export const sendTokenInCookie = async (req: Request, userId: string): Promise<void> => {
	const authToken = await generateTokenForUser(userId) 
	req.session = { authToken, userId } 		// before authController
}

export const removeTokenFromCookie = async (req: Request): Promise<void> => {
	// const authToken = req.session?.authToken
	// if(!authToken) return
	// const { id } = await verifyUserAuthToken(authToken)
	// if(id) req.session = null

	const id = await getUserIdFromAuthToken(req)
	if(id) req.session = null
}


export const getUserIdFromAuthToken = async (req: Request): Promise<string> => {
	const errorMessage = 'you are not authenticated user, plsese login first'

	const authToken = req.session?.authToken || req.headers.authorization?.replace('Bearer ', '')
	if(!authToken) throw new Error(errorMessage)

	const { id } = await verifyUserAuthToken(authToken)
	if(!id) throw Error('payload.id missing error')

	return id
}




