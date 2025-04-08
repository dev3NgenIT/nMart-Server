import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'


type SocialMediaLinks = {
	website: string
	facebook: string
	instagram: string
	linkedIn: string
	whatsApp: string
	twitter: string
	youTube: string
	reddit: string
	tumblr: string
	tiktok: string
}

export type Site = {
	isActive: boolean

	updateBy: Types.ObjectId

	siteMotto: string
	siteUrl: string
	salesEmail: string
	primaryPhone: string
	alternativePhone: string
	googleAnalytics: string
	googleAbsense: string
	maintenanceMode: boolean
	companyName: string
	systemTimezone: string 		// text like 'UTC', 'EST', etc valueeee, select option
	socialMediaLinks: SocialMediaLinks


	name: string
	slug: string
	phoneOne?: string
	phoneTwo?: string

	whatsappNumber?: string
	contactEmail?: string
	supportEmail?: string
	infoEmail?: string
	about?: string
	addressOne?: string
	addressTwo?: string

	defaultLanguage?: string
	defaultCurrency?: string
	copyrightUrl?: string
	copyrightTitle?: string
	metaKeyword?: string
	metaDescription?: string

	favicon?: Image
	systemLogoWhite?:  Image
	systemLogoBlack?:  Image
	metaImage?: Image

	// page: {
	// 	contactUs: ContactUs
	// }

	// contactUsTitle: string
	// contactUsDescription: string
	// contactUsPhone: string
	// contactUsEmail: string
	// contactUsAddress: string
}
export type SiteDocument = Document & Site

export type CreateSite = Site
export type UpdateSite = Site


export type SiteModel = Model<SiteDocument> & { }
