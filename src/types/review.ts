import type { Types, Document, Model } from 'mongoose'
import type { Image } from '@/types/common'

type CommonReview = {
	product: Types.ObjectId,
	like: number, 

	review: string, 							// used for review
	images: Image[]
	rating: number, 			
}

export type ReviewDocument = Document & CommonReview & {
	user: Types.ObjectId, 				
	// likes: Types.ObjectId[],
}

export type CreateReview = CommonReview & {
	user: Types.ObjectId, 				
}
export type UpdateReview = CommonReview 


// export type ReviewModel = Model<ReviewDocument> & {
// 	populate(arg0: string): unknown
// }