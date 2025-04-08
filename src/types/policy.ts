import type { Document, Model } from 'mongoose'
import type { PolicyType } from './common'

/*
{
  "type": "faq",
	"title": "Privacy Policy",
	"description": "This policy explains how we collect, use, and protect your personal data.",
	"effectiveDate": "2024-01-01",
	"expireDate": "2026-01-01",
	"isVisible": true
},

faq, privary, terms-and-conditions
*/
export type Policy = {
	type: PolicyType

	title: string
	description: string
	effectiveDate: Date
	expireDate: Date

	isVisible: boolean
}
export type PolicyDocument = Document & Policy

export type CreatePolicy = Policy
export type UpdatePolicy = Policy

export type PolicyModel = Model<PolicyDocument> & { }