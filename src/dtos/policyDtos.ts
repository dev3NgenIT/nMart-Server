import type { CreatePolicy, PolicyDocument, UpdatePolicy } from '@/types/policy'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'type',

	'title',
	'description',
	'effectiveDate',
	'expireDate',

	'isVisible',
]


// POST 	/api/policies
export const filterBodyForCreatePolicy = (body: CreatePolicy) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// policy => policy._doc
export const filterPolicyDocument = (body: PolicyDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/policies/:policyId
export const filterBodyForUpdatePolicy = (body: UpdatePolicy) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


