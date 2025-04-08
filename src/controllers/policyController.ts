import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { PolicyDocument } from '@/types/policy'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import * as policyDtos from '@/dtos/policyDtos'
import Policy from '@/models/policyModel'


// GET /api/policies
export const getPolicies: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Policy, req.query, filter)
	const policies = await query
	
	const responseData: ResponseData<PolicyDocument[]> = {
		status: 'success',
		count: policies.length,
		total,
		data: policies,
	}
	res.status(200).json( responseData )
})


// POST 	/api/policies
export const addPolicy: RequestHandler =  catchAsync(async (req, res, next) => {

	const filteredBody = policyDtos.filterBodyForCreatePolicy(req.body)
	const policy = await Policy.create(filteredBody)
	if(!policy) return next(appError('policy not found'))

	const responseData: ResponseData = {
		status: 'success',
		data: policy,
	}
	res.status(201).json( responseData )
})

// GET /api/policies/:policyId
export const getPolicyById:RequestHandler = catchAsync(async (req, res, next) => {
	const policyId = req.params.policyId

	const policy = await Policy.findById(policyId)
	if(!policy) return next(appError('policy not found'))
	
	const responseData: ResponseData<PolicyDocument> = {
		status: 'success',
		data: policy
	}
	res.status(200).json( responseData )
})


// PATCH /api/policies/:policyId
export const updatePolicyById:RequestHandler = catchAsync(async (req, res, next) => {
	const policyId = req.params.policyId

	const filteredBody = policyDtos.filterBodyForUpdatePolicy(req.body)
	const policy = await Policy.findByIdAndUpdate(policyId, filteredBody, { new: true })
	if(!policy) return next(appError('policy update failed'))


	const responseData: ResponseData<PolicyDocument> = {
		status: 'success',
		data: policy
	}

	res.status(200).json( responseData )
})


// DELETE /api/policies/:policyId
export const deletePolicyById:RequestHandler = catchAsync(async (req, res, next) => {
	const policyId = req.params.policyId

	const policy = await Policy.findByIdAndDelete(policyId)
	if(!policy) return next(appError('policy not found'))

	const responseData: ResponseData<PolicyDocument> = {
		status: 'success',
		data: policy
	}
	res.status(200).json( responseData )
})