import type { RequestHandler } from 'express'
import type { ResponseData, Image } from '@/types/common'
import type { HomeDocument } from '@/types/home'
import { promisify } from 'util'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures, getDataUrlSize } from '@/lib/utils'
import Home from '@/models/homeModel'
import * as fileService from '@/services/fileService'
import { isValidObjectId } from 'mongoose'
import { maxImageSize } from '@/types/constants'



// => GET 	/api/homes
export const getHomes: RequestHandler = catchAsync(async (req, res, next) => {
	let filter = {}

	const { query, total } = await apiFeatures(Home, req.query, filter)
	const homes = await query

	const responseData: ResponseData<HomeDocument[]> = {
		status: 'success',
		count: homes.length,
		total,
		data: homes,
	}
	res.status(200).json(responseData)
})






export const addHome: RequestHandler = async (req, res, next) => {
	try {

		if(req.body.mainBanner) {
			if( req.body.mainBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.mainBanner)
				if(imageSize > maxImageSize) return next(appError(`mainBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: mainBanner } = await fileService.uploadFile(req.body.mainBanner, '/homes')
			if(error) return next(appError(`mainBanner image upload error: ${error}`))
			req.body.mainBanner = mainBanner
		}

		if(req.body.flashSaleBanner) {
			if( req.body.flashSaleBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.flashSaleBanner)
				if(imageSize > maxImageSize) return next(appError(`flashSaleBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: flashSaleBanner } = await fileService.uploadFile(req.body.flashSaleBanner, '/homes')
			if(error) return next(appError(`flashSaleBanner image upload error: ${error}`))
			req.body.flashSaleBanner = flashSaleBanner
		}


		if(req.body?.middleBanners1?.length) {
			const middleBanners1 = req.body.middleBanners1.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners1 = await Promise.all( middleBanners1 )
		}
		if(req.body?.middleBanners2?.length) {
			const middleBanners2 = req.body.middleBanners2.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners2 = await Promise.all( middleBanners2 )
		}
		if(req.body.middleBanners3?.length) {
			const middleBanners3 = req.body.middleBanners3.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners3 = await Promise.all( middleBanners3 )
		}

		if(req.body.giftCardBanners?.length) {
			const giftCardBanners = req.body.giftCardBanners.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.giftCardBanners = await Promise.all( giftCardBanners )
		}



		delete req.body.isActive  	// only update my seperate route
		const home = await Home.create(req.body)
		if(!home) return next(appError('create home failed', 400, 'failed'))

		const responseData: ResponseData<HomeDocument> = {
			status: 'success',
			data: home,
		}
		res.status(201).json(responseData)

	} catch (err) {
		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.mainBanner?.secure_url)
		}, 1000)

		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.flashSaleBanner?.secure_url)
		}, 1000)

		setTimeout(() => {
			req.body?.middleBanners1.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)
		setTimeout(() => {
			req.body?.middleBanners2.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)
		setTimeout(() => {
			req.body?.middleBanners3.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)
		setTimeout(() => {
			req.body?.giftCardBanners.forEach( (image: Image) => {
				promisify(fileService.removeFile)(image?.secure_url)
			})
		}, 1000)


		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}



// => GET /api/homes/:homeId
export const getHomeById:RequestHandler = catchAsync(async (req, res, next) => {
	const homeId = req.params.homeId

	const home = await Home.findById(homeId)
	if(!home) return next(appError('home not found'))
	
	const responseData: ResponseData<HomeDocument> = {
		status: 'success',
		data: home
	}
	res.status(200).json(responseData)
})


// => PATCH /api/homes/:homeId
export const updateHomeById:RequestHandler = async (req, res, next) => {
	try {
		const homeId = req.params.homeId
		const home = await Home.findById(homeId) 
		if(!home) return next(appError('home not found'))

		if(req.body.mainBanner) {
			if( req.body.mainBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.mainBanner)
				if(imageSize > maxImageSize) return next(appError(`mainBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: mainBanner } = await fileService.uploadFile(req.body.mainBanner, '/homes')
			if(error) return next(appError(`mainBanner image upload error: ${error}`))

			// update with new image
			req.body.mainBanner = mainBanner
		}

		if(req.body.flashSaleBanner) {
			if( req.body.flashSaleBanner.startsWith('data:') ) {
				const imageSize = getDataUrlSize(req.body.flashSaleBanner)
				if(imageSize > maxImageSize) return next(appError(`flashSaleBanner size cross the max image size: ${imageSize}`))
			}

			const { error, image: flashSaleBanner } = await fileService.uploadFile(req.body.flashSaleBanner, '/homes')
			if(error) return next(appError(`flashSaleBanner image upload error: ${error}`))

			// update with new image
			req.body.flashSaleBanner = flashSaleBanner
		}

		if(req.body?.middleBanners1?.length) {
			const middleBanners1 = req.body.middleBanners1.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`middleBanners1 size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners1 = await Promise.all( middleBanners1 )
		}
		if(req.body?.middleBanners2?.length) {
			const middleBanners2 = req.body.middleBanners2.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`middleBanners2 size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners2 = await Promise.all( middleBanners2 )
		}
		if(req.body?.middleBanners3?.length) {
			const middleBanners3 = req.body.middleBanners3.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`middleBanners3 size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.middleBanners3 = await Promise.all( middleBanners3 )
		}
		if(req.body?.giftCardBanners?.length) {
			const giftCardBanners = req.body.giftCardBanners.map( async (dataUrl: string) => {
				// Check image size
				if( dataUrl.startsWith('data:') ) {
					const imageSize = getDataUrlSize(dataUrl)
					if(imageSize > maxImageSize) return next(appError(`giftCardBanners size cross the max image size: ${imageSize}`))
				} 

				// save image into disk
				const { error: imageError, image } = await fileService.uploadFile(dataUrl, '/homes')
				if(imageError || !image) throw new Error(imageError) 

				return image
			})
			req.body.giftCardBanners = await Promise.all( giftCardBanners )
		}

		delete req.body.isActive  	// only update my seperate route
		const updateHome = await Home.findByIdAndUpdate(homeId, req.body, { new: true }) 
		if(!updateHome) return next(appError('home home found'))
		
		if(req.body.mainBanner) {
			req.body.mainBanner = home.mainBanner 	// add existing mainBanner, so that it can be deleted later

			// delete old mainBanner if have
			setTimeout(() => {
				if(home.mainBanner?.secure_url) promisify(fileService.removeFile)(home.mainBanner.secure_url)
			}, 1000)
		}
		if(req.body.flashSaleBanner) {
			req.body.flashSaleBanner = home.flashSaleBanner 	

			setTimeout(() => {
				if(home.flashSaleBanner?.secure_url) promisify(fileService.removeFile)(home.flashSaleBanner.secure_url)
			}, 1000)
		}

		if(req.body.middleBanners1 && home.middleBanners1?.length) {
			req.body.middleBanners1 = home.middleBanners1

			home.middleBanners1.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.middleBanners2 && home.middleBanners2?.length) {
			req.body.middleBanners2 = home.middleBanners2

			home.middleBanners2.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.middleBanners3 && home.middleBanners3?.length) {
			req.body.middleBanners3 = home.middleBanners3

			home.middleBanners3.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.giftCardBanners && home.giftCardBanners?.length) {
			req.body.giftCardBanners = home.giftCardBanners

			home.giftCardBanners.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}


		
		const responseData: ResponseData<HomeDocument> = {
			status: 'success',
			data: updateHome
		}
		res.status(201).json(responseData)

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.mainBanner?.secure_url) promisify(fileService.removeFile)(req.body.mainBanner.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.flashSaleBanner?.secure_url) promisify(fileService.removeFile)(req.body.flashSaleBanner.secure_url)
		}, 1000)

		if(req.body.middleBanners1?.length) {
			req.body.middleBanners1.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.middleBanners2?.length) {
			req.body.middleBanners2.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.middleBanners3?.length) {
			req.body.middleBanners3.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}
		if(req.body.giftCardBanners?.length) {
			req.body.giftCardBanners.forEach( (image: Image) => {
				setTimeout(() => {
					promisify(fileService.removeFile)(image.secure_url)
				}, 1000)
			})
		}


		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// => DELETE /api/homes/:homeId
export const deleteHomeById:RequestHandler = catchAsync(async (req, res, next) => {
	const homeId = req.params.homeId

	const filter = (isValidObjectId(homeId)) ?  { _id: homeId } : { slug: homeId }
	const home = await Home.findOneAndDelete(filter) 
	if(!home) return next(appError('home not found'))
	
	// delete existing coverPhoto if have
	setTimeout(() => {
		if(home.mainBanner?.secure_url) promisify(fileService.removeFile)(home.mainBanner.secure_url)
	}, 1000)
	setTimeout(() => {
		if(home.flashSaleBanner?.secure_url) promisify(fileService.removeFile)(home.flashSaleBanner.secure_url)
	}, 1000)

	// delete existing middleBanners1 if have
	home?.middleBanners1?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})
	home?.middleBanners2?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})
	home?.middleBanners2?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})
	home?.giftCardBanners?.forEach( (image: Image) => {
		setTimeout(() => {
			promisify(fileService.removeFile)(image.secure_url)
		}, 1000)
	})

	const responseData: ResponseData<HomeDocument> = {
		status: 'success',
		data: home
	}
	res.status(200).json(responseData)
})


// PATCH /api/homes/:homeId/change-active
export const changeActiveProperty = catchAsync( async (req, res, next) => {
	const homeId = req.params.homeId

	const home = await Home.findById(homeId)
	if(!home) return next(appError('home not found'))

  await Home.bulkWrite([
      {
        updateMany: {
          filter: {}, 																// Set all documents to inactive
          update: { $set: { isActive: false } },
        },
      },
      {
        updateOne: {
          filter: { _id: homeId }, 								// Set the selected document to active
          update: { $set: { isActive: true } },
        },
      },
    ])

	const responseData: ResponseData = {
		status: 'success',
		message: 'update home isActive done'
	}
	res.status(200).json( responseData )
})