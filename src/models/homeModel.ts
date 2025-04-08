import type { Model } from 'mongoose'
import type { HomeDocument } from '@/types/home'
import type { Image } from '@/types/common'
import { model, Schema } from 'mongoose'
import { Collection } from '@/types/constants'
import { sanitizeSchema } from '@/services/sanitizeService'
import { customTransform } from '@/lib/utils'

/*
{
	"mainBanner": "https://...",
	"flashSaleBanner": "https://...",

	"middleBanners1": [
		"https://...",
		"data:image/jpg;...",
		"data:image/jpg;..."
	],
	"middleBanners2": [
		"https://...",
		"data:image/jpg;...",
		"data:image/jpg;..."
	],
	"middleBanners3": [
		"https://...",
		"data:image/jpg;...",
		"data:image/jpg;..."
	],
	"giftCardBanners": [
		"https://...",
		"data:image/jpg;...",
		"data:image/jpg;..."
	],
  
}
*/


const imageSchema = new Schema<Image>({
	public_id: {
		type: String,
		required: true,
	},
	secure_url: {
		type: String,
		required: true,
	}
})
// imageSchema.set('toJSON', {
//   virtuals: true,
//   transform: (_doc, ret) => {
// 		customTransform(ret, [] )
//   },
// })


const homePageSchema = new Schema<HomeDocument>({
	isActive: {
		type: Boolean,
		default: false,
	},


	mainBanner: {
		public_id: String,
		secure_url: String,
	},
	mainBannerRedirectUrl: String,
	flashSaleBanner: {
		public_id: String,
		secure_url: String,
	},
	flashSaleBannerRedirectUrl: String,
	middleBanners1: [imageSchema],
	middleBanners2: [imageSchema],
	middleBanners3: [imageSchema],
	giftCardBanners: [imageSchema],


}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const imageFields = [
				'mainBanner', 
				'flashSaleBanner',
				'middleBanners1',
				'middleBanners2',
				'middleBanners3',
				'giftCardBanners',
			]
			customTransform(ret, imageFields )
		},
	}
})


homePageSchema.plugin(sanitizeSchema)

const Home = model<HomeDocument, Model<HomeDocument>>(Collection.Home, homePageSchema)
export default Home

