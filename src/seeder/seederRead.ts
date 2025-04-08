import Product from '@/models/productModel'

export const seederRead = async () => {
	try {
		// Step-1: Get all products
		const insertedProducts = await Product.find({})
		console.log(insertedProducts)
		
	} catch (err: unknown) {

		if(err instanceof Error) return console.log(err.message)
		console.log(err)

	} finally {
		process.exit(0)
	}
}