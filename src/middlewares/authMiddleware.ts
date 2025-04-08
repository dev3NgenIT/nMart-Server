import type { CheckAdmin, RestrictTo } from '@/types/common'
import type { Session } from '@/types/session'
import { appError, catchAsync } from '@/controllers/errorController'
import { Roles } from '@/types/constants'



// export const checkAdmin: RequestHandler = catchAsync( async (req, res, next) => {

// 	const isAdmin = req.session?.user.role === Roles.ADMIN
// 	if(!isAdmin) return next(appError('only admin user can delete others user'))
	
// 	next()
// })



export const checkAdmin: CheckAdmin = (role: typeof Roles) => catchAsync( async (req, res, next) => {

	const isAdmin = req.session?.user.role === Roles.ADMIN
	if(!isAdmin) return next(appError('only admin user can delete others user'))
	
	next()
})


export const restrictTo: RestrictTo = (...roles: string[]) => (req, _res, next) => {
	const session = req.session as Session
	const user = session.user

	if(!user?.role) return next(appError('user.role not found', 404, 'AuthError'))

	const message = `Sorry you ( role: '${user?.role}' ) don't have permission to perform this action.`
	if(!roles.includes(user.role)) return next(appError(message, 403, 'PermissionDenied'))

	next()
}