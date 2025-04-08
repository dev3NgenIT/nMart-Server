import { Router } from 'express'
import * as offerController from '@/controllers/offerController'


// => /api/offers
export const router = Router()


router.route('/')
	.get(offerController.getOffers)
	.post(offerController.addOffer)

router.route('/:offerId')
	.get(offerController.getOfferByIdOrSlug)
	.patch(offerController.updateOfferByIdOrSlug)
	.delete(offerController.deleteOfferByIdOrSlug)
