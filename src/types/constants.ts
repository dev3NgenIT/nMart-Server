export const maxImageSize = 1024 * 1024 * 5 			// => 5 MB

export enum Collection {
	User = 'User',
	Brand = 'Brand',

	Category = 'Category',
	SubCategory = 'SubCategory',
	ChildCategory = 'ChildCategory',
	Product = 'Product',
	Review = 'Review',
	Blog = 'Blog',
	Site = 'Site',
	Offer = 'Offer',
	BlogCategory = 'BlogCategory',
	WishList = 'WishList',
	Coupon = 'Coupon',
	ProductReviewLike = 'ProductReviewLike',
	Policy = 'Policy',

	Faq = 'Faq',
	FaqCategory = 'FaqCategoryaq',
	FaqQuestion = 'FaqQuestion',

	Home = 'Home',
	AboutUs = 'AboutUs',
	ContactUs = 'ContactUs',

	Subscribe = 'Subscribe',

	ShippingInfo = 'ShippingInfo',
	BillingInfo = 'BillingInfo',
	Order = 'Order',
}


export const Gender = {
	MALE: 'male',
	FEMALE: 'female',
	OTHER: null
}
// export enum Role {
// 	vendor='vendor',
// 	user='user',
// 	admin='admin',
// }


export const Roles = {
  SUPER_ADMIN: 'super_admin',
  SITE_SETTING: 'site_setting',
  ADMIN: 'admin',
  USER: 'user',
} as const

// type Role = keyof typeof Roles 												// => "VENDOR" | "USER" | "ADMIN"
// type Role = [keyof typeof Roles] 											// => [ "VENDOR" | "USER" | "ADMIN" ]
// type Role = (typeof Roles)[keyof typeof Roles] 				// => type Role = "vendor" | "user" | "admin"

// const roles = Object.values(Roles) 										// => [ 'vendor', 'user', 'admin' ]



export const PaymentStatus = {
	PENDING: 'pending',
	PROCESSING: 'processing',
	SHIFTED: 'shifted',
	DELIVERED: 'delivered',
	CANCELLED: 'cancelled',
	RETURNED: 'returned',
} as const

export const PaymentTypes = {
	CASH_ON_DELIVERY: 'cash_on_delivery',
	STRIPE: 'STRIPE',
	SSLCOMMERZ: 'SSLCOMMERZ'
}



export const PolicyType = {
	FAQ: 'faq',
	PRIVACY: 'privacy',
	REFUND: 'refund',
	TERMANDCONDITION: 'terms-and-condition',
} as const