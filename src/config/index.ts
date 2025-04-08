
export const listOfOrigins = [
	'http://dev6.ngenit.com', 
	'http://dev6.ngenit.com:5000', 
	'http://dev6.ngenit.com:3000', 
	'http://dev6.ngenit.com:5173', 

	'http://192.168.0.222:5000', 
	'http://192.168.0.222:3000', 
	'http://192.168.0.222:5173',

	'http://localhost:5000', 
	'http://localhost:3000', 
	'http://localhost:5173',

	'http://139.59.0.223:5000',
	'http://139.59.0.223:5173',
	'http://139.59.0.223:3000',
]



export const { 
	SESSION_SECRET,  
	NODE_ENV, 
	PORT,

	SERVER_ORIGIN,
	CLIENT_ORIGIN,

	MAIL_SERVICE,
	MAIL_HOST,
	MAIL_PORT,
	MAIL_AUTH_USER,
	MAIL_AUTH_PASS,
	OTP_SECRET,

	DB_MOUNTED_PORT,

	STRIPE_SECRET_KEY,
	STRIPE_PUBLISHABLE_KEY,

	SSL_COMMERZ_STORE_ID,
	SSL_COMMERZ_STORE_PASSWD,
	SSL_COMMERZ_IS_LIVE,

} = process.env || {}


// mongoose transform option: 	used in utils/customTransform()
export const server = {
	origin: SERVER_ORIGIN || 'http://localhost:5000'
}


export const client = {
	origin: NODE_ENV === 'production' ? SERVER_ORIGIN : CLIENT_ORIGIN 
}


// nodemailer
if(!MAIL_SERVICE || !MAIL_HOST || !MAIL_PORT || !MAIL_AUTH_USER || !MAIL_AUTH_PASS) throw new Error(`hey!, nodemailer missing credentials`)
export const googleMail = {
	service: MAIL_SERVICE,
	host: MAIL_HOST,
	port: parseInt(MAIL_PORT),
	auth: {
		user: MAIL_AUTH_USER,
		pass: MAIL_AUTH_PASS,
	}
}


export const DB = {
	HOST_PORT: PORT,
	MOUNTED_PORT: DB_MOUNTED_PORT,
}

export const stripeScret = {
	secretKey: STRIPE_SECRET_KEY as string,
	publishableKey: STRIPE_PUBLISHABLE_KEY as string,
}


if(!SSL_COMMERZ_STORE_ID || !SSL_COMMERZ_STORE_PASSWD ) throw new Error(`sslCommerz: missing credentials`)

export const sslSecret = {
	storeId: SSL_COMMERZ_STORE_ID,
	storePassword: SSL_COMMERZ_STORE_PASSWD,
	isLive: SSL_COMMERZ_IS_LIVE === 'true' 	
}