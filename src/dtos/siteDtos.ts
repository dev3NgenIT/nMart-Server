import type { SiteDocument, CreateSite, UpdateSite } from '@/types/site'
import { filterObjectByArray } from '@/lib/utils'

const commonFields = [
	"updateBy",

	"siteMotto",
	"siteUrl",
	"salesEmail",
	"primaryPhone",
	"alternativePhone",
	"googleAnalytics",
	"googleAbsense",
	"maintenanceMode",
	"companyName",
	"systemTimezone",
	"socialMediaLinks",

	"name",
	"slug",
	"phoneOne",
	"phoneTwo",
	"whatsappNumber",
	"contactEmail",
	"supportEmail",
	"infoEmail",
	"about",
	"addressOne",
	"addressTwo",

	"defaultLanguage",
	"defaultCurrency",
	"copyrightUrl",
	"copyrightTitle",

	"metaKeyword",
	"metaDescription",

	"favicon",
	"systemLogoWhite",
	"systemLogoBlack",
	"metaImage",

	// 'contactUsTitle',
	// 'contactUsDescription',
	// 'contactUsPhone',
	// 'contactUsEmail',
	// 'contactUsAddress',
]

// POST 	/api/sites
export const filterBodyForCreateSite = (body: CreateSite) => {
	const allowedFields = [
		...commonFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// brand => brand._doc
export const filterSiteDocument = (body: SiteDocument) => {
	const allowedFields = [
		...commonFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/sites/:siteId
export const filterBodyForUpdateSite = (body: UpdateSite) => {

	const allowedFields = [
		...commonFields
	]
	return filterObjectByArray(body, allowedFields)
}


