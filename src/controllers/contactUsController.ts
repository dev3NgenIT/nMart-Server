import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { ContactUsDocument } from '@/types/contactUs'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import ContactUs from '@/models/contactUsModel'


// GET /api/contact-up
export const getContactUs: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(ContactUs, req.query, filter)
	const contactUses = await query
	
	const responseData: ResponseData<ContactUsDocument[]> = {
		status: 'success',
		count: contactUses.length,
		total,
		data: contactUses,
	}
	res.status(200).json( responseData )
})


// POST 	/api/contact-us
export const addContactUs: RequestHandler =  catchAsync(async (req, res, next) => {

	delete req.body.isActive 	// only update my seperate route

	const contactUs = await ContactUs.create(req.body)
	if(!contactUs) return next(appError('contactUs not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: contactUs,
	}
	res.status(201).json( responseData )
})

// GET /api/contact-us/:contactUsId
export const getContactUsById:RequestHandler = catchAsync(async (req, res, next) => {
	const contactUsId = req.params.contactUsId

	const contactUs = await ContactUs.findById(contactUsId)
	if(!contactUs) return next(appError('contactUs not found'))
	
	const responseData: ResponseData<ContactUsDocument> = {
		status: 'success',
		data: contactUs
	}
	res.status(200).json( responseData )
})


// PATCH /api/contact-us/:contactUsId
export const updateContactUsById:RequestHandler = catchAsync(async (req, res, next) => {
	const contactUsId = req.params.contactUsId

	delete req.body.isActive  	// only update my seperate route
	const contactUs = await ContactUs.findByIdAndUpdate(contactUsId, req.body, { new: true })
	if(!contactUs) return next(appError('contactUs update failed'))


	const responseData: ResponseData<ContactUsDocument> = {
		status: 'success',
		data: contactUs
	}

	res.status(200).json( responseData )
})


// DELETE /api/contact-us/:contactUsId
export const deleteContactUsById:RequestHandler = catchAsync(async (req, res, next) => {
	const contactUsId = req.params.contactUsId

	const contactUs = await ContactUs.findByIdAndDelete(contactUsId)
	if(!contactUs) return next(appError('contactUs not found'))

	const responseData: ResponseData<ContactUsDocument> = {
		status: 'success',
		data: contactUs
	}
	res.status(200).json( responseData )
})


// PATCH /api/contact-us/:contactUsId/change-active
export const changeActiveProperty = catchAsync( async (req, res, next) => {
	const contactUsId = req.params.contactUsId

	const contactUs = await ContactUs.findById(contactUsId)
	if(!contactUs) return next(appError('contactUs not found'))

  await ContactUs.bulkWrite([
      {
        updateMany: {
          filter: {}, 																// Set all documents to inactive
          update: { $set: { isActive: false } },
        },
      },
      {
        updateOne: {
          filter: { _id: contactUsId }, 								// Set the selected document to active
          update: { $set: { isActive: true } },
        },
      },
    ])

	const responseData: ResponseData = {
		status: 'success',
		message: 'update contactUs isActive done'
	}
	res.status(200).json( responseData )
})