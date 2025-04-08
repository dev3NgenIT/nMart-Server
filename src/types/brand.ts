import type { Document, Model } from 'mongoose'
import type { Image } from '@/types/common'



export type Brand = {
	name: string
	slug: string
	description?: string
	isVisible: boolean

	// image?: Image
	logo?: Image
	thumbnail?: Image
	banner?: Image
}
export type BrandDocument = Document & Brand

export type CreateBrand = Brand
export type UpdateBrand = Brand

// export type CreateBrand = {
// 	name: string
// 	description: string
// 	isVisible: boolean

// 	image?: Image
// 	logo?: Image
// 	thumbnail?: Image
// 	banner?: Image
// }


// export type UpdateBrand = {
// 	name: string
// 	description: string
// 	isVisible: boolean

// 	image?: Image
// 	logo?: Image
// 	thumbnail?: Image
// 	banner?: Image
// }



export type BrandModel = Model<BrandDocument> & { }