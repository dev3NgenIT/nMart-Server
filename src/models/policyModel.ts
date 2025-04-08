import type { PolicyDocument, PolicyModel } from '@/types/policy'
import { Collection, PolicyType } from '@/types/constants'
import { model, Schema } from 'mongoose'
import { customTransform } from '@/lib/utils'


/*
{
  "type": "faq",
	"title": "Privacy Policy",
	"description": "This policy explains how we collect, use, and protect your personal data.",
	"effectiveDate": "2024-01-01",
	"expireDate": "2026-01-01",
	"isVisible": true
},
*/


const policySchema = new Schema<PolicyDocument>({
	type: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		// enum: Object.values(PolicyType)
		enum: {
			values: Object.values(PolicyType),
			message: `field "{PATH}" must be one of: ${Object.values(PolicyType).join(' | ')}`
		},
	},
	title: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 200,
	},
	description: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 3,
		maxlength: 5000,
	},
	effectiveDate: Date,
	expireDate: Date,
	
	isVisible: {
		type: Boolean,
		default: true
	},

}, {
	timestamps: true,
	toJSON: {
		transform(_doc, ret, _options) {
			customTransform(ret, [] )
		},
	}
})

policySchema.pre('save', function (this:PolicyDocument, next) {
	this.effectiveDate = new Date( this.effectiveDate )
	this.expireDate = new Date( this.expireDate )
	
	next()
})

export const Policy = model<PolicyDocument, PolicyModel>(Collection.Policy, policySchema)
export default Policy