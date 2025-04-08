import type { UserDocument, UserModel } from '@/types/user'
import { Roles, Collection, Gender } from '@/types/constants'
import { model, Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'
import crypto from 'node:crypto'
import isEmail from 'validator/lib/isEmail'
import { sanitizeSchema } from '@/services/sanitizeService'
import { customTransform } from '@/lib/utils'


/*
{
	"clientId" : "alksdjalkjdalkjdjfakj",

	"fname" : "Riajul",
	"lname" : "Islam",
  "username": "username1",
	"email" : "riajul.delete1@gmail.com",
  "password": "{{pass}}",
  "confirmPassword": "{{pass}}",

	"role" : "admin",

	"phone" : "",
	"gender" : "male",
	"bio" : "my bio goes here...",

	"dateOfBirth" : "1995-03-08",
	"address" : {
		"street" : "315 hazipara badda",
		"city": "Dhaka",
		"state": "Dhaka",
		"postCode": 1212,
		"country": "Bangladesh"
	},


	"passwordResetToken": "String",
	"emailResetToken": "String",
	"emailResetTokenExpires": "1995-03-08",

	"isActive": true,
	"isVerified": true,

	"coverPhoto" : "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",
	"avatar" : "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
}


*/




const userSchema = new Schema<UserDocument>({
	clientId: String, 		// for social media login like: Google | Facebook | ...

	username: {
		type: String,
		// unique: true,
		trim: true,
		lowercase: true,
		// minlength: 3,
		// maxlength: 50,
	},
	fname: {
		type: String,
		required: true,
		trim: true,
		// lowercase: true,
		// minlength: 3,
		// maxlength: 30,
	},
	lname: {
		type: String,
		required: true,
		trim: true,
		// lowercase: true,
		// minlength: 3,
		// maxlength: 30,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false, 									// no need this any more because we hide in toJSON 
	},
	confirmPassword: {
		type: String,
		// required: true,
		validate: function(this: UserDocument, confirmPassword: string, ) {
			return this.password === confirmPassword
		},
	},

	role: {
		type: String,
		enum: {
			values: Object.values(Roles),
			message: `field "{PATH}" must be one of: ${Object.values(Roles).join(' | ')}`
		},
		trim: true,
		lowercase: true,
		default: Roles.USER
	},

	gender: {
		type: String,
		lowercase: true, 											
		// enum: Object.values(Gender), 						// if use Enum value, then default value must be comes from Gender, hardCoded value throw error.
		enum: {
			values: Object.values(Gender),
			message: `field "{PATH}" must be one of: ${Object.values(Gender).join(' | ')}`
		},
		default: Gender.OTHER
	},
	dateOfBirth: Date,

	bio: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		// maxlength: 30,
	},
	phone: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 8,
	},

	address: {
		street: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 300,
		},
		city: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 2,
			maxlength: 50,
		},
		state: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 2,
			maxlength: 50,
		},
		postCode: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 6,
		},
		country: {
			type: String,
			trim: true,
			lowercase: true,
			minlength: 3,
			maxlength: 30,
		},
	},

	// likes: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Product',
	// }],
	// carts: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Product',
	// }],

	// orders: [{ 													
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Payment',
	// }],

	isActive: {
		type: Boolean,
		default: true
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	isVisible: {
		type: Boolean,
		default: true
	},


	coverPhoto: {
		public_id: String,
		secure_url: String,
	},
	avatar: {
		public_id: String,
		secure_url: String
	},


	otpCode: String,
	passwordResetToken: String,
	emailResetToken: String,
	emailResetTokenExpires: Date
}, {
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform(_doc, ret, _options) {
			delete ret.password  					// hide password, so no need extra code other palaces
			delete ret.confirmPassword  	// hide confirmPassword, so no need extra code other palaces

			const imageFields = ['avatar', 'coverPhoto']
			customTransform(ret, imageFields )
		},
	}
})

userSchema.plugin(sanitizeSchema)

userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})

userSchema.methods.comparePassword = async function(this: UserDocument, password: string ) {
	return await bcryptjs.compare(password, this.password)
}

/* 	const user = await User.findOne()
		const token = await user.passwordResetToken() */
userSchema.methods.getPasswordResetToken = async function (this: UserDocument) {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	await this.save({ validateBeforeSave: false }) 	// validation requires all the fields

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}


userSchema.methods.createEmailResetToken = async function() {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.emailResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	this.emailResetTokenExpires = Date.now() + 1000 * 60 * 10 	// now + 10 Minure
	await this.save({ validateBeforeSave: false })

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}

userSchema.methods.handleEmailUpdate = async function(this: UserDocument, resetToken: string, email: string) {
	/* if expire date is not bigger than current time, that means time expires
			We can it in 2 ways:
				1. when we query 	: 	await User.findOne({ passwordResetToken: resetToken, passwordResetTokenExpires: {$gt: Date.now()} })
				2. const isExpires = new Date(this.passwordResetTokenExpires) < new Date()
	*/

	if( !this.emailResetToken ) return false 						// don't have resetToken so no need to perform next
	if( !this.emailResetTokenExpires ) return false 		// don't have resetToken so no need to perform next
	if(!isEmail(email)) return false

	if( new Date(this.emailResetTokenExpires) < new Date() ) return false

	const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	if( hashedResetToken !== this.emailResetToken ) return false

	this.email = email

	this.emailResetToken = undefined
	this.emailResetTokenExpires = undefined

	/* Must need to update passwordChangedAt property, so that password changed after login or not, can be chedked
			We can it also in 2 ways/place:
				1. here like this 	:	this.passwordChangedAt = new Date()
				2. in middleware 		:

				.pre('save', function() {
					if( !this.isModified('password') ) return
					this.passwordChangedAt: new Date();
					next()
				})
						. middleware is the parject place for this job, because it run everytime automatically without any warry.
							but because it is only need to update once, so method (1) is ok too */

	await this.save({ validateBeforeSave: false })

	return this
}


/* 	const user = await User.findOne()
		const token = await user.passwordResetToken() */
userSchema.methods.getPasswordResetToken = async function (this: UserDocument) {
	const resetToken = crypto.randomBytes(32).toString('hex')

	// save the hashed version in database, and return unhashed, so that hash it again then compare it
	this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	await this.save({ validateBeforeSave: false }) 	// validation requires all the fields

	// return to unhashed version to user, which will be send via email (securely)
	return resetToken
}




userSchema.virtual('fullName').get(function() {
	return `${this.fname} ${this.lname}`
})



export const User = model<UserDocument, UserModel>(Collection.User, userSchema)
export default User


