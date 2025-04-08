import Product from '@/models/productModel'

export const seederDelete = async () => {
	try {
		await Product.deleteMany({})
		console.log('products collection deleted successfully !!!')
		
	} catch (err: unknown) {

		if(err instanceof Error) return console.log(err.message)
		console.log(err)

	} finally {
		process.exit(0)
	}
}