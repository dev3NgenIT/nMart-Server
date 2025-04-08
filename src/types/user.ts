import type { Document, Model, Types } from 'mongoose'
import type { GenderType, Image, Role } from '@/types/common'


type Address = {
  street: string
	city: string
	state: string
	postCode: number
	country: string
}

type CommonFields = {

	coverPhoto: Image
	avatar: Image

	username: string
	gender: GenderType

	fname: string
	lname: string
	fullName: string 		// for virtual('fullName')
	phone: string
	bio: string
  dateOfBirth: Date
	address: Address

	isActive: boolean
	isVerified: boolean
	isVisible: boolean
}

export type CreateUser = CommonFields & {
	clientId: String, 		// for social media login like: Google | Facebook | ...

	email: string
	password: string
	confirmPassword?: string
}

export type UserDocument = Document & CommonFields & {
	clientId: String, 		// for social media login like: Google | Facebook | ...
	_id: Types.ObjectId
	updatedAt: Date 			// required to update this

	role: Role
	email: string
	password: string
	confirmPassword?: string

	otpCode?: string
	passwordResetToken?: string
	emailResetToken: string | undefined
	emailResetTokenExpires: Date | undefined

	// user.methods types defined in document, not model
	getPasswordResetToken: () => Promise<string>
	comparePassword: (password: string) => Promise<boolean>

	// likes: Types.ObjectId[] 				// wishlist
	// carts: Types.ObjectId[] 				// cart items
	// orders: Types.ObjectId[]

	// otherPermissions : OtherPermissions
}

export type UpdateUser = CommonFields

export type UserModel = Model<UserDocument> & {

	createEmailResetToken: () => Promise<string>
	handleEmailUpdate: (resetToken: string, email: string) => Promise<boolean>
}



export type UpdateOTP = {
	otpCode?: number
}