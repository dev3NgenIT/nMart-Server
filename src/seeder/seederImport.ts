import Product from '@/models/productModel'
import { products } from '@/seeder/data'

export const seederImport = async () => {
	try {
		// Step-1: Delete old products
		await Product.deleteMany({}) 	

		// Step-2: Insert new products
		const insertedProducts = await Product.create(products)
		console.log('products inserted successfully !!!')
		// console.log(insertedProducts)
		
	} catch (err: unknown) {

		if(err instanceof Error) return console.log(err.message)
		console.log(err)

	} finally {
		process.exit(0)
	}
}