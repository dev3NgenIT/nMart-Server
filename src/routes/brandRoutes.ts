import { Router } from 'express'
import * as brandController from '@/controllers/brandController'


// => /api/brands
export const router = Router()


router.route('/')
	.get(brandController.getBrands)
	.post(brandController.addBrand)

router.route('/many')
	.delete(brandController.deletelBrandsByIds)

router.route('/:brandId')
	.get(brandController.getBrandById)
	.patch(brandController.updateBrandById)
	.delete(brandController.deleteBrandById)
