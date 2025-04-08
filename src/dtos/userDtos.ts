import type { CreateUser, UpdateOTP, UpdateUser, UserDocument } from '@/types/user'
import { filterObjectByArray } from '@/lib/utils'

/* DTO = Data Transfer Object
	- To modify or alter any property of an object before send to client.

		- like do don't need all the property to send back to user, just need
				cupple of then so we need only send those only.

		- if we need to modify or alter any property name before send to client
				not modify in database level than can be done in DTO.

				doc = {
					_id,
					createdAt,
					updatedAt,
					_v,
					id
					...
				}

				dto = {
					_id,
					createdAt,
					id
					...
				}

*/


const commonAllowedFields = [
	"fname",
	"lname",
	"username",
	"email",
	"password",
	"confirmPassword",
	"phone",
	"gender",
	"bio",
	"dateOfBirth",
	"address",
	"coverPhoto",
	"avatar",
	"isVisible",


]

// POST 	/api/users
export const filterBodyForCreateUserByAdmin = (body: CreateUser) => {
	const allowedFields = [
		"fname",
		"lname",
		"email",
		"password",
		"confirmPassword",
		"role",
	]

	return filterObjectByArray(body, allowedFields)
}



// POST 	/api/auth/register
export const filterBodyForCreateUser = (body: CreateUser) => {
	const allowedFields = [
		...commonAllowedFields,

	]

	return filterObjectByArray(body, allowedFields)
}

// user => user._doc
export const filterUserDocument = (user: UserDocument) => {
	const allowedFields = [
		...commonAllowedFields,
		"clientId",
		"passwordResetToken",
		"emailResetToken",
		"emailResetTokenExpires",

		"isActive",
		'isVerified',
		"role",

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(user, allowedFields)
}


// PATCH 	/api/users/:userId
// PATCH 	/api/users/me
export const filterBodyForUpdate = (body: UpdateUser) => {
	const allowedFields = [
		...commonAllowedFields,

		"role",

		'isVerified',
		"isActive",
	]
	return filterObjectByArray(body, allowedFields)
}



// POST 	/api/auth/update-otp
export const updateOTPCode = (body: UpdateOTP) => {
	const allowedFields = [
		'otpCode'
	]

	return filterObjectByArray(body, allowedFields)
}



