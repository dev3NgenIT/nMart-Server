import type { CreateSubscribe, SubscribeDocument, UpdateSubscribe } from '@/types/subscribe'
import { filterObjectByArray } from '@/lib/utils'

const commonAllowedFields = [
	'user',
	'email',
]


// POST 	/api/subscribes
export const filterBodyForCreateSubscribe = (body: CreateSubscribe) => {
	const allowedFields = [
		...commonAllowedFields,
	]

	return filterObjectByArray(body, allowedFields)
}

// Subscribe => Subscribe._doc
export const filterSubscribeDocument = (body: SubscribeDocument) => {
	const allowedFields = [
		...commonAllowedFields,

		'id',
		'_id',
		'createdAt',
		'updatedAt',
	]
	return filterObjectByArray(body, allowedFields)
}


// PATCH 	/api/subscribes/:subscribeId
export const filterBodyForUpdateSubscribe = (body: UpdateSubscribe) => {

	const allowedFields = [
		...commonAllowedFields,
	]
	return filterObjectByArray(body, allowedFields)
}


