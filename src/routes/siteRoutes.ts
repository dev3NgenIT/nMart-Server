import { Router } from 'express'
import * as siteController from '@/controllers/siteController'


// => /api/sites
export const router = Router()

router.route('/first') .get(siteController.getSiteFirstOne)

router.route('/')
	.get(siteController.getSites)
	.post(siteController.addSite)

router.route('/:siteId')
	.get(siteController.getSiteByIdOrSlug)
	.patch(siteController.updateSiteByIdOrIdOrSlug)
	.delete(siteController.deleteSiteByIdOrSlug)

router.route('/:siteId/change-active')
	.patch(siteController.changeActiveProperty)