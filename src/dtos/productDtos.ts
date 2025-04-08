import type { CreateProduct, ProductDocument } from '@/types/product'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'user',
	'brand',
	'childCategory',
	'category',
	'subCategory',

  'skuCode',
  'manufacturerCode',
	'name',
	'slug',
	'summary',
	'description',

	'price',
  'discount',
  'quantity',
  'vat',
  'tax',

	'coverPhoto',
	'thumbnail',
	'images',

  'stock',

	'color',
	'colors',
	'size',

	'specification',
	'metadata',
	'flashSale',
]

// POST 	/api/products
export const filterBodyForCreateProduct = (body: CreateProduct) => {
	const allowedFields = [ ...commonAllowedFields ]
	return filterObjectByArray(body, allowedFields)
}

// PATCH 	/api/products
export const filterBodyForUpdateProduct = (body: CreateProduct) => {
	const allowedFields = [ 
		...commonAllowedFields,
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// product => product._doc
export const filterProductDocument = (user: ProductDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(user, allowedFields)
}


