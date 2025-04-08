const fs = require('fs')

const images = [
	'images/mainBanner',
	'images/flashSaleBanner.png',

	'images/middleBanners1.1.png',
	'images/middleBanners1.2.png',

	'images/middleBanners2.1.png',
	'images/middleBanners2.2.png',

]
const imageUrl = 'images/middleBanners3.1.png'

const imageBuffer = fs.readFileSync(imageUrl)
const base64 = imageBuffer.toString('base64')
const readAsDataURL = `data:image/jpg;base64,${base64}`

fs.writeFileSync('dataUrl.txt', readAsDataURL)


