import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'

export type AboutUs = {
	isActive: boolean
	header: string
	slogan: string

	topBanner: Image

	column1Badge: string
	column1Title: string
	column1Description: string
	column1Image: Image

	column2Badge: string
	column2Title: string
	column2Description: string

	column3Badge: string
	column3Title: string
	column3Description: string
	column3Image: Image
}

export type AboutUsDocument = Document & AboutUs & { }
export type CreateAboutUs = AboutUs & { }
export type UpdateAboutUs = AboutUs

export type AboutUsModel = Model<AboutUsDocument> & { }
