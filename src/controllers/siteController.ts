import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { SiteDocument } from '@/types/site'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import * as fileService from '@/services/fileService'
import * as siteDtos from '@/dtos/siteDtos'
import Site from '@/models/siteModel'
import { isValidObjectId } from 'mongoose'


// GET /api/sites
export const getSites: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Site, req.query, filter)
	const sites = await query
	
	const responseData: ResponseData<SiteDocument[]> = {
		status: 'success',
		count: sites.length,
		total,
		data: sites,
	}
	res.status(200).json( responseData )
})


// POST 	/api/sites
export const addSite: RequestHandler =  async (req, res, next) => {
	try {

		if(req.body.favicon) {
			const { error, image: favicon } = await fileService.uploadFile(req.body.favicon, '/sites')
			if(error) return next(appError(`site favicon upload error: ${error}`))

			// update with new favicon, if update fialed then delete this favicon from catch block
			req.body.favicon = favicon
		}

		if(req.body.systemLogoWhite) {
			const { error, image: systemLogoWhite } = await fileService.uploadFile(req.body.systemLogoWhite, '/sites')
			if(error) return next(appError(`site systemLogoWhite upload error: ${error}`))

			req.body.systemLogoWhite = systemLogoWhite
		}

		if(req.body.systemLogoBlack) {
			const { error, image: systemLogoBlack } = await fileService.uploadFile(req.body.systemLogoBlack, '/sites')
			if(error) return next(appError(`site systemLogoBlack upload error: ${error}`))

			req.body.systemLogoBlack = systemLogoBlack
		}
		if(req.body.metaImage) {
			const { error, image: metaImage } = await fileService.uploadFile(req.body.metaImage, '/sites')
			if(error) return next(appError(`site metaImage upload error: ${error}`))

			req.body.metaImage = metaImage
		}

		delete req.body.isActive  	// only update my seperate route
		const filteredBody = siteDtos.filterBodyForCreateSite(req.body)
		const site = await Site.create(filteredBody)
		if(!site) return next(appError('site not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: site,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.favicon?.secure_url) promisify(fileService.removeFile)(req.body.favicon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.systemLogoWhite?.secure_url) promisify(fileService.removeFile)(req.body.systemLogoWhite.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.systemLogoBlack?.secure_url) promisify(fileService.removeFile)(req.body.systemLogoBlack.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.metaImage?.secure_url) promisify(fileService.removeFile)(req.body.metaImage.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/sites/:siteId
export const getSiteByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const siteId = req.params.siteId
	const filter = (isValidObjectId(siteId)) ?  { _id: siteId } : { slug: siteId }

	const site = await Site.findOne(filter)
	if(!site) return next(appError('site not found'))
	
	const responseData: ResponseData<SiteDocument> = {
		status: 'success',
		data: site
	}
	res.status(200).json( responseData )
})


// GET /api/sites/first
export const getSiteFirstOne:RequestHandler = catchAsync(async (req, res, next) => {
	const site = await Site.findOne()
	if(!site) return next(appError('site not found'))
	
	const responseData: ResponseData<SiteDocument> = {
		status: 'success',
		data: site
	}
	res.status(200).json( responseData )
})


// PATCH /api/sites/:siteId
export const updateSiteByIdOrIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const siteId = req.params.siteId
		const filter = (isValidObjectId(siteId)) ?  { _id: siteId } : { slug: siteId }

		const site = await Site.findOne(filter)
		if(!site) return next(appError('site not found'))


		if(req.body.favicon) {
			const { error, image: favicon } = await fileService.uploadFile(req.body.favicon, '/sites')
			if(error) return next(appError(`site favicon upload error: ${error}`))

			req.body.favicon = favicon
		}
		if(req.body.systemLogoWhite) {
			const { error, image: systemLogoWhite } = await fileService.uploadFile(req.body.systemLogoWhite, '/sites')
			if(error) return next(appError(`site systemLogoWhite upload error: ${error}`))

			req.body.systemLogoWhite = systemLogoWhite
		}
		if(req.body.systemLogoBlack) {
			const { error, image: systemLogoBlack } = await fileService.uploadFile(req.body.systemLogoBlack, '/sites')
			if(error) return next(appError(`site systemLogoBlack upload error: ${error}`))

			req.body.systemLogoBlack = systemLogoBlack
		}
		if(req.body.metaImage) {
			const { error, image: metaImage } = await fileService.uploadFile(req.body.metaImage, '/sites')
			if(error) return next(appError(`site metaImage upload error: ${error}`))

			req.body.metaImage = metaImage
		}

		delete req.body.isActive  	// only update my seperate route
		const filteredBody = siteDtos.filterBodyForUpdateSite(req.body)
		const updatedCategory = await Site.findByIdAndUpdate(siteId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('site update failed'))


		if(req.body.favicon) {
			req.body.favicon = site.favicon 	
			
			setTimeout(() => {
				if(site.favicon?.secure_url) promisify(fileService.removeFile)(site.favicon.secure_url)
			}, 1000)
		}

		if(req.body.systemLogoWhite) {
			req.body.systemLogoWhite = site.systemLogoWhite 	
			
			setTimeout(() => {
				if(site.systemLogoWhite?.secure_url) promisify(fileService.removeFile)(site.systemLogoWhite.secure_url)
			}, 1000)
		}
		if(req.body.systemLogoBlack) {
			req.body.systemLogoBlack = site.systemLogoBlack 	
			
			setTimeout(() => {
				if(site.systemLogoBlack?.secure_url) promisify(fileService.removeFile)(site.systemLogoBlack.secure_url)
			}, 1000)
		}
		if(req.body.metaImage) {
			req.body.metaImage = site.metaImage 	
			
			setTimeout(() => {
				if(site.metaImage?.secure_url) promisify(fileService.removeFile)(site.metaImage.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<SiteDocument> = {
			status: 'success',
			data: updatedCategory
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.favicon?.secure_url) promisify(fileService.removeFile)(req.body.favicon.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.systemLogoWhite?.secure_url) promisify(fileService.removeFile)(req.body.systemLogoWhite.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.systemLogoBlack?.secure_url) promisify(fileService.removeFile)(req.body.systemLogoBlack.secure_url)
		}, 1000)
		setTimeout(() => {
			if(req.body.metaImage?.secure_url) promisify(fileService.removeFile)(req.body.metaImage.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/sites/:siteId
export const deleteSiteByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const siteId = req.params.siteId
	const filter = (isValidObjectId(siteId)) ?  { _id: siteId } : { slug: siteId }

	const site = await Site.findOneAndDelete(filter)
	if(!site) return next(appError('site not found'))

	// delete existing image if have
	setTimeout(() => {
		if(site.favicon?.secure_url) promisify(fileService.removeFile)(site.favicon.secure_url)
	}, 1000)
	setTimeout(() => {
		if(site.systemLogoWhite?.secure_url) promisify(fileService.removeFile)(site.systemLogoWhite.secure_url)
	}, 1000)
	setTimeout(() => {
		if(site.systemLogoBlack?.secure_url) promisify(fileService.removeFile)(site.systemLogoBlack.secure_url)
	}, 1000)
	setTimeout(() => {
		if(site.metaImage?.secure_url) promisify(fileService.removeFile)(site.metaImage.secure_url)
	}, 1000)


	const responseData: ResponseData<SiteDocument> = {
		status: 'success',
		data: site
	}
	res.status(200).json( responseData )
})


// PATCH /api/sites/:siteId/change-active
export const changeActiveProperty = catchAsync( async (req, res, next) => {
	const siteId = req.params.siteId

	const site = await Site.findById(siteId)
	if(!site) return next(appError('site not found'))

  await Site.bulkWrite([
      {
        updateMany: {
          filter: {}, 																// Set all documents to inactive
          update: { $set: { isActive: false } },
        },
      },
      {
        updateOne: {
          filter: { _id: siteId }, 										// Set the selected document to active
          update: { $set: { isActive: true } },
        },
      },
    ])

	const responseData: ResponseData = {
		status: 'success',
		message: 'update site isActive done'
	}
	res.status(200).json( responseData )
})