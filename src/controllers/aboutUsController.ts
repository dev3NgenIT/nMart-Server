import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { AboutUsDocument } from '@/types/aboutUs'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import * as fileService from '@/services/fileService'
import AboutUs from '@/models/aboutUsModel'
import { isValidObjectId } from 'mongoose'


// GET /api/about-us
export const getAboutUs: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(AboutUs, req.query, filter)
	const aboutUs = await query
	
	const responseData: ResponseData<AboutUsDocument[]> = {
		status: 'success',
		count: aboutUs.length,
		total,
		data: aboutUs,
	}
	res.status(200).json( responseData )
})


// POST 	/api/about-us
export const addAboutUs: RequestHandler =  async (req, res, next) => {
	try {

		if(req.body.topBanner) {
			const { error, image: topBanner } = await fileService.uploadFile(req.body.topBanner, '/aboutUs')
			if(error) return next(appError(`aboutUs topBanner upload error: ${error}`))

			// update with new topBanner, if update fialed then delete this topBanner from catch block
			req.body.topBanner = topBanner
		}
		if(req.body.column1Image) {
			const { error, image: column1Image } = await fileService.uploadFile(req.body.column1Image, '/aboutUs')
			if(error) return next(appError(`aboutUs column1Image upload error: ${error}`))

			req.body.column1Image = column1Image
		}
		if(req.body.column3Image) {
			const { error, image: column3Image } = await fileService.uploadFile(req.body.column3Image, '/aboutUs')
			if(error) return next(appError(`aboutUs column3Image upload error: ${error}`))

			req.body.column3Image = column3Image
		}

		delete req.body.isActive // only update my seperate route

		const aboutUs = await AboutUs.create(req.body)
		if(!aboutUs) return next(appError('aboutUs not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: aboutUs,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.topBanner?.secure_url) promisify(fileService.removeFile)(req.body.topBanner.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.column1Image?.secure_url) promisify(fileService.removeFile)(req.body.column1Image.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.column3Image?.secure_url) promisify(fileService.removeFile)(req.body.column3Image.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/about-us/:aboutUsId
export const getAboutUsById:RequestHandler = catchAsync(async (req, res, next) => {
	const aboutUsId = req.params.aboutUsId
	const filter = (isValidObjectId(aboutUsId)) ?  { _id: aboutUsId } : { slug: aboutUsId }

	const aboutUs = await AboutUs.findOne(filter)
	if(!aboutUs) return next(appError('aboutUs not found'))
	
	const responseData: ResponseData<AboutUsDocument> = {
		status: 'success',
		data: aboutUs
	}
	res.status(200).json( responseData )
})


// PATCH /api/about-us/:aboutUsId
export const updateAboutUsById:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const aboutUsId = req.params.aboutUsId
		// const aboutUs = await aboutUs.findById(aboutUsId)
		// const filter = { _id: aboutUsId }
		const filter = (isValidObjectId(aboutUsId)) ?  { _id: aboutUsId } : { slug: aboutUsId }

		const aboutUs = await AboutUs.findOne(filter)
		if(!aboutUs) return next(appError('aboutUs not found'))


		if(req.body.topBanner) {
			const { error, image: topBanner } = await fileService.uploadFile(req.body.topBanner, '/aboutUs')
			if(error) return next(appError(`aboutUs topBanner upload error: ${error}`))

			req.body.topBanner = topBanner
		}
		if(req.body.column1Image) {
			const { error, image: column1Image } = await fileService.uploadFile(req.body.column1Image, '/aboutUs')
			if(error) return next(appError(`aboutUs column1Image upload error: ${error}`))

			req.body.column1Image = column1Image
		}
		if(req.body.column3Image) {
			const { error, image: column3Image } = await fileService.uploadFile(req.body.column3Image, '/aboutUs')
			if(error) return next(appError(`aboutUs column3Image upload error: ${error}`))

			req.body.column3Image = column3Image
		}

		delete req.body.isActive  	// only update my seperate route

		const updatedAboutUs = await AboutUs.findByIdAndUpdate(aboutUsId, req.body, { new: true })
		if(!updatedAboutUs) return next(appError('aboutUs update failed'))


		if(req.body.topBanner) {
			req.body.topBanner = aboutUs.topBanner 	
			
			setTimeout(() => {
				if(aboutUs.topBanner?.secure_url) promisify(fileService.removeFile)(aboutUs.topBanner.secure_url)
			}, 1000)
		}

		if(req.body.column1Image) {
			req.body.column1Image = aboutUs.column1Image 	
			
			setTimeout(() => {
				if(aboutUs.column1Image?.secure_url) promisify(fileService.removeFile)(aboutUs.column1Image.secure_url)
			}, 1000)
		}
		if(req.body.column3Image) {
			req.body.column3Image = aboutUs.column3Image 	
			
			setTimeout(() => {
				if(aboutUs.column3Image?.secure_url) promisify(fileService.removeFile)(aboutUs.column3Image.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<AboutUsDocument> = {
			status: 'success',
			data: updatedAboutUs
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.topBanner?.secure_url) promisify(fileService.removeFile)(req.body.topBanner.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.column1Image?.secure_url) promisify(fileService.removeFile)(req.body.column1Image.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.column3Image?.secure_url) promisify(fileService.removeFile)(req.body.column3Image.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/about-us/:aboutUsId
export const deleteAboutUsById:RequestHandler = catchAsync(async (req, res, next) => {
	const aboutUsId = req.params.aboutUsId

	const aboutUs = await AboutUs.findById(aboutUsId)
	if(!aboutUs) return next(appError('aboutUs not found'))

	const updatedAboutUs = await AboutUs.findByIdAndDelete(aboutUsId)
	if(!updatedAboutUs) return next(appError('aboutUs deletion failed'))

	// delete existing image if have
	setTimeout(() => {
		if(aboutUs.topBanner?.secure_url) promisify(fileService.removeFile)(aboutUs.topBanner.secure_url)
	}, 1000)
	setTimeout(() => {
		if(aboutUs.column1Image?.secure_url) promisify(fileService.removeFile)(aboutUs.column1Image.secure_url)
	}, 1000)
	setTimeout(() => {
		if(aboutUs.column3Image?.secure_url) promisify(fileService.removeFile)(aboutUs.column3Image.secure_url)
	}, 1000)


	const responseData: ResponseData<AboutUsDocument> = {
		status: 'success',
		data: aboutUs
	}
	res.status(200).json( responseData )
})


// PATCH /api/about-us/:aboutUsId/change-active
export const changeActiveProperty = catchAsync( async (req, res, next) => {
	const aboutUsId = req.params.aboutUsId

	const aboutUs = await AboutUs.findById(aboutUsId)
	if(!aboutUs) return next(appError('aboutUs not found'))

  await AboutUs.bulkWrite([
      {
        updateMany: {
          filter: {}, 																// Set all documents to inactive
          update: { $set: { isActive: false } },
        },
      },
      {
        updateOne: {
          filter: { _id: aboutUsId }, 								// Set the selected document to active
          update: { $set: { isActive: true } },
        },
      },
    ])

	// const updatedAboutUs = await AboutUs.findById(aboutUsId)
	// if(!updatedAboutUs) return next(appError('aboutUs update failed'))

	// const responseData: ResponseData<AboutUsDocument> = {
	const responseData: ResponseData = {
		status: 'success',
		message: 'update about-us isActive done'
	}
	res.status(200).json( responseData )
})