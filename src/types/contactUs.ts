import type { Document, Model, Types } from 'mongoose'

export type ContactUs = {
	// user: Types.ObjectId
	isActive: boolean

	fname: string
	lname: string
	phone: string
	email: string
	subject: string
	message: string
}

export type ContactUsDocument = Document & ContactUs & { }
export type CreateContactUs = ContactUs & { }
export type UpdateContactUs = ContactUs

export type ContactUsModel = Model<ContactUsDocument> & { }
