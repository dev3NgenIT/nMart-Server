import type { RequestHandler } from 'express'
import type { ResponseData, Image } from '@/types/common'
import type { ProductDocument } from '@/types/product'
import { promisify } from 'util'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures, getDataUrlSize, transformId } from '@/lib/utils'
import Product from '@/models/productModel'
import * as fileService from '@/services/fileService'
import * as productDto from '@/dtos/productDtos'
import { isValidObjectId } from 'mongoose'
import { maxImageSize } from '@/types/constants'
import Order from '@/models/orderModel'
import Review from '@/models/reviewModel';



// => GET 	/api/products
export const getProducts: RequestHandler = catchAsync(async (req, res, next) => {
	const userId = req.params.userId === 'me' ? req.session?.userId : req.params.userId

	let filter = {}
	if(userId) filter = { user: userId.toString() } 

	if(req.query.colors) {
		const { color, price } = req.query.colors as any
		filter = {
			colors: {
				$elemMatch: {
					color: color
				},
			},
		}
	}


	const { query, total } = await apiFeatures(Product, req.query, filter)
	const products = await query

	const responseData: ResponseData<ProductDocument[]> = {
		status: 'success',
		total,
		count: products.length,
		data: products,
	}
	res.status(200).json(responseData)
})


export const addProduct: RequestHandler = async (req, res, next) => {
	try {
		// if(!req.body.coverPhoto) return next(appError('coverPhoto field required'))
		// if(!req.body.images?.length) return next(appError('you must pass images of array'))
		// if(req.body.images.length > 3 ) return next(appError('only allow upto 3 images'))


		if(req.body.coverPhoto) {
			if( req.body.coverPhoto.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.coverPhoto)
				if(imageSize > maxImageSize) return next(appError(`coverPhoto size cross the max image size: ${imageSize}`))
			}

			const { error, image: coverPhoto } = await fileService.uploadFile(req.body.coverPhoto, '/products')
			if(error) return next(appError(`coverPhoto image upload error: ${error}`))
			req.body.coverPhoto = coverPhoto
		}
		if(req.body.thumbnail) {
			if( req.body.thumbnail.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.thumbnail)
				if(imageSize > maxImageSize) return next(appError(`thumbnail size cross the max image size: ${imageSize}`))
			}

			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/products')
			if(error) return next(appError(`thumbnail image upload error: ${error}`))
			req.body.thumbnail = thumbnail
		}

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/products')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.images = await Promise.all( images )
		}



		const filteredBody = productDto.filterBodyForCreateProduct(req.body)
		const product = await Product.create(filteredBody)
		if(!product) return next(appError('create product failed', 400, 'failed'))

		const responseData: ResponseData<ProductDocument> = {
			status: 'success',
			data: product,
		}
		res.status(201).json(responseData)

	} catch (err) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.coverPhoto?.secure_url)
		}, 1000)

		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.thumbnail?.secure_url)
		}, 1000)

		setTimeout(() => {
			req.body.images.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)


		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}



// => GET /api/products/:productId
export const getProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const { query, total } = await apiFeatures(Product, req.query, filter)
	const products = await query.limit(1)

	if(!products.length) return next(appError('product not found'))
	// const product = await Product.findOne(filter) 
	// if(!product) return next(appError('product not found'))
	
	const responseData: ResponseData<ProductDocument> = {
		status: 'success',
		data: products[0]
	}
	res.status(200).json(responseData)
})


// => PATCH /api/products/:productId
export const updateProductByIdOrSlug:RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const productId = req.params.productId
		const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
		const product = await Product.findOne(filter) 
		if(!product) return next(appError('product not found'))

		if(req.body.coverPhoto) {
			if( req.body.coverPhoto.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.coverPhoto)
				if(imageSize > maxImageSize) return next(appError(`coverPhoto size cross the max image size: ${imageSize}`))
			}

			const { error, image: coverPhoto } = await fileService.uploadFile(req.body.coverPhoto, '/products')
			if(error) return next(appError(`coverPhoto image upload error: ${error}`))

			// update with new image
			req.body.coverPhoto = coverPhoto
		}
		if(req.body.thumbnail) {
			if( req.body.thumbnail.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.thumbnail)
				if(imageSize > maxImageSize) return next(appError(`thumbnail size cross the max image size: ${imageSize}`))
			}

			const { error, image: thumbnail } = await fileService.uploadFile(req.body.thumbnail, '/products')
			if(error) return next(appError(`thumbnail image upload error: ${error}`))

			// update with new image
			req.body.thumbnail = thumbnail
		}

		if(req.body.images?.length) {
			const images = req.body.images.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`images size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/products')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.images = await Promise.all( images )
		}

		const filteredBody = productDto.filterBodyForUpdateProduct(req.body)
		const updatedProduct = await Product.findOneAndUpdate(filter, filteredBody, { new: true }) 
		if(!updatedProduct) return next(appError('product product found'))
		
		if(req.body.coverPhoto) {
			req.body.coverPhoto = product.coverPhoto 	// add existing coverPhoto, so that it can be deleted later

			// delete old coverPhoto if have
			setTimeout(() => {
				if(product.coverPhoto?.secure_url) promisify(fileService.removeFile)(product.coverPhoto.secure_url)
			}, 1000)
		}
		if(req.body.thumbnail) {
			req.body.thumbnail = product.thumbnail 	

			setTimeout(() => {
				if(product.thumbnail?.secure_url) promisify(fileService.removeFile)(product.thumbnail.secure_url)
			}, 1000)
		}

		if(req.body.images && product.images?.length) {
			req.body.images = product.images

			product.images.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}


		
		const responseData: ResponseData<ProductDocument> = {
			status: 'success',
			data: updatedProduct
		}
		res.status(201).json(responseData)

	} catch (err) {
		setTimeout(() => {
			if(req.body.coverPhoto?.secure_url) promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.thumbnail?.secure_url) promisify(fileService.removeFile)(req.body.thumbnail.secure_url)
		}, 1000)

		if(req.body.images?.length) {
			req.body.images.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}


		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})

// => DELETE /api/products/:productId
export const deleteProductByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const productId = req.params.productId

	const filter = (isValidObjectId(productId)) ?  { _id: productId } : { slug: productId }
	const product = await Product.findOneAndDelete(filter) 
	if(!product) return next(appError('product not found'))
	
	// delete existing coverPhoto if have
	setTimeout(() => {
		if(product.coverPhoto?.secure_url) promisify(fileService.removeFile)(product.coverPhoto.secure_url)
	}, 1000)
	setTimeout(() => {
		if(product.thumbnail?.secure_url) promisify(fileService.removeFile)(product.thumbnail.secure_url)
	}, 1000)

	// delete existing images if have
	product.images?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})

	const responseData: ResponseData<ProductDocument> = {
		status: 'success',
		data: product
	}
	res.status(200).json(responseData)
})


// => DELETE /api/products/many
export const deletelProductsByIds:RequestHandler = catchAsync( async (req, res, next) => {

	const productIds = req.body.productIds || []
	const products = await Product.find({_id: { $in: productIds }})
	if(!products.length) return next(appError('no products found'))

	const deletedProducts = await Product.deleteMany({_id: { $in: productIds }})
	if(deletedProducts.deletedCount === 0 ) return next(appError('product deletation failed'))

	products.forEach( (product) => {

		// delete existing coverPhoto if have
		setTimeout(() => {
			if(product.coverPhoto?.secure_url) promisify(fileService.removeFile)(product.coverPhoto.secure_url)
		}, 1000)
		setTimeout(() => {
			if(product.thumbnail?.secure_url) promisify(fileService.removeFile)(product.thumbnail.secure_url)
		}, 1000)

		// delete existing images if have
		product.images?.forEach( (image: Image) => {
			setTimeout(() => {
				promisify(fileService.removeFile)(image.secure_url)
			}, 1000)
		})

	})

	const responseData: ResponseData<ProductDocument[]> = {
		status: 'success',
		// count: products.length,
		count: deletedProducts.deletedCount,
		data: products
	}
	res.status(200).json(responseData)
})




// => GET 	/api/products/random-products?_limit=5
export const getRandomProducts:RequestHandler = catchAsync(async (req, res, _next) => {
	const limit = Number(req.query._limit) || 12

	const products = await Product.aggregate().sample(limit)

	const responseData: ResponseData<ProductDocument[]> = {
		status: 'success',
		total: products.length,
		count: products.length,
		data: products,
	}
	res.status(200).json(responseData)
})



// => GET 	/api/products/popular-products?_limit=10
export const getPopularProducts = catchAsync( async (req, res) => {
	const _limit = +(req.query._limit || 10)

	const popularProducts = await Order.aggregate([
		{ $unwind: "$products" }, 				// flatten products : to used as document for filter easily
		{ 
			$group: { 
				_id: "$products.product", 
				totalSold: { $sum: "$products.quantity" } 
			} 
		},
		{ $sort: { totalSold: -1 } },
		{ $limit: _limit },
		{
			$lookup: {
				from: "products", 									// to populate product by id from products collection name, not mongoose schema name
				localField: "_id",
				foreignField: "_id",
				as: "products" 											// required a name for output filtered products
			}
		},
		{ $unwind: "$products" }, 							// adds toalSold on every products

		// to replace _id => id
		// {
		// 	$set: {
		// 		id: "$_id", 												// Add id field
		// 		"products.id": "$products._id" 			// Add id field inside product details
		// 	}
		// },
		// {
		// 	$unset: ["_id", "products._id"] 			// Remove original _id fields
		// }
	])


	const responseData: ResponseData<ProductDocument[]> = {
		status: 'success',
		count: popularProducts.length,
		// data: popularProducts,
		data: transformId(popularProducts),
	}
	res.status(200).json(responseData)
})




// => GET /api/products/un-reviewed-products
export const getUnReviewedProductsFromOrder: RequestHandler = catchAsync(async (req, res, next) => {
  const userId = req.params.userId === 'me' ? req.params.userId : req.session?.userId 
  if(!userId) return next(appError('You are not logedin User'))


	// Step 1: Get all products ordered by the user
	const orders = await Order.find({ "user.id": userId }).select('products')
	const orderedProductIds = new Set( orders.flatMap(order => order.products.map( p => p.id.toString())))


	// Step 2: Get all products reviewed by the user
	const reviews = await Review.find({ user: userId }).select("product")
	const reviewedProductIds = new Set( reviews.map(review => review.product.toString()) )

	// Step 3: Filter products that are ordered but not reviewed
	const unreviewedProductIds = [...orderedProductIds].filter(id => !reviewedProductIds.has(id))

	// Step 4: Fetch product details
	const unreviewedProducts = await Product.find({ _id: { $in: unreviewedProductIds } })


  // Step 5: Return the response
  const responseData: ResponseData<ProductDocument[]> = {
    status: 'success',
    total: unreviewedProducts.length,
    count: unreviewedProducts.length,
    data: unreviewedProducts,
  }

  res.status(200).json(responseData)
})
