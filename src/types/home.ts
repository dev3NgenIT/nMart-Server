import type { Document, Model, Types } from 'mongoose'
import type { Image } from '@/types/common'

export type Home = {
	isActive: boolean

	mainBannerRedirectUrl: string
	flashSaleBannerRedirectUrl: string,

	mainBanner: Image
	flashSaleBanner: Image

	middleBanners1: Image[]
	middleBanners2: Image[]
	middleBanners3: Image[]
	giftCardBanners: Image[]
}

export type HomeDocument = Document & Home & { }
export type CreateHome = Home & { }
export type UpdateHome = Home

export type HomeModel = Model<HomeDocument> & { }

