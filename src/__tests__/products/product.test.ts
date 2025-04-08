// import request from 'supertest'
// import { app } from '@/app'
// // import { products } from '@/seeder/data'

it('products', () => { })


// describe.skip('POST /api/products', () => {
// 	// const [ firstProduct ] = products

// 	const body = {
// 		name: 'product testing 1',
// 		price: 100,
// 		coverPhoto: 'https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias/blob/main/public/absolutePath_vs_relativePath.png?raw=true'
// 	}

// 	it('add product', async () => {
			
// 		const createdRes = await request(app)
// 		.post('/api/products')
// 		.send( body )
//     .set('Content-Type', 'application/json')
// 		.set('Authorization', 'Bearer your_token') 	

// 		expect(createdRes.status).toBe(201)
// 		expect(createdRes.body).toHaveProperty('status') 
// 		expect(createdRes.body.status).toBe('success')
// 		expect(createdRes.body).toHaveProperty('data') 


// 		const getRes = await request(app)
// 		.get('/api/products')
//     .set('Content-Type', 'application/json')

// 		expect(getRes.status).toBe(200)
// 		expect(getRes.body).toHaveProperty('status') 
// 		expect(getRes.body.status).toBe('success')
// 		expect(getRes.body).toHaveProperty('data') 
// 		expect(getRes.body.data).toHaveLength(1)
// 		expect(getRes.body.data[0]).toHaveProperty('name')

// 		// console.log(getRes.body.data)
// 	})

// })


