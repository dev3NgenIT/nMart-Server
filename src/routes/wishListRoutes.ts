import { Router } from 'express'
import * as wishListController from '@/controllers/wishListController'


// => /api/wishlists
export const router = Router()


router.route('/')
	.get(wishListController.getWishLists)
	.post(wishListController.addWishList)

router.route('/:wishListId')
	.get(wishListController.getWishListById)
	.patch(wishListController.updateWishListById)
	.delete(wishListController.deleteWishListById)
