import 'dotenv/config'
import { googleMail, NODE_ENV } from '@/config'
import { createTransport } from 'nodemailer'

/*
	try {
		await sendMail({
			from: 'dev6.ngenit@gmail.com',
			to: 'your_target_user@gmail.com',
			subject: 'Testing | sending OTP via email',
			text: `otp: ${otp}`
		})

	} catch (err) {
		...
	}
*/

export const sendMail = async ({
	from='dev6.ngenit@gmail.com',  												// from the application
	to='',  																							// to sender email
	subject='(only valid for 10 minutes)',  //
	text='default message' 																//
} = {}) => {


	const transporter = createTransport({
		// service: googleMail.service,
  	host: googleMail.host,
		port: googleMail.port,
  	secure: NODE_ENV !== 'development', 
		auth: { 
			user: googleMail.auth.user, 
			pass: googleMail.auth.pass,
		}
	})

	await transporter.sendMail({from, to, subject, text})
}

// host: "smtp.gmail.com",
// port: 587,
// auth: {
// 	user: "dev6.ngenit@gmail.com",
// 	pass: "rmyh bgpd qyej whzu",
// },

// const sendEmail = async (to, subject, text) => {
//   const msg = { from: "dev6.ngenit@gmail.com", to, subject, text };
//   await transport.sendMail(msg);
// };


/*
const transporter = createTransport({
  service: 'gmail', // Use 'gmail' as the service
  host: 'smtp.gmail.com', // Gmail's SMTP server
  port: 587, // Port for TLS
  secure: false, // Use TLS
  auth: {
    user: googleMail.auth.user, // Your Gmail email address
    pass: googleMail.auth.pass, // Your Gmail app password or account password
  },
});

*/