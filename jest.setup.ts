import 'module-alias/register'
import 'tsconfig-paths/register'

/*
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'
import { app } from '@/app'
import request from 'supertest'

const mongo = new MongoMemoryServer()

// Step-1: Create database connection
beforeAll( async () => {
	await mongo.start()
	const mongoUri = mongo.getUri()

	await connect(mongoUri)
})


// Step-2: Delete old data, and Register new user before run any test
beforeEach( async () => {
	const collections = await connection.db?.collections()
	if(!collections) return

	for( let collection of collections ) {
		collection.deleteMany() 							// delete data from every collection
	}



  // Register a default user by calling the /api/auth/register endpoint
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'riajul@gmail.com.com',
      password: 'asdfasdf',
      confirmPassword: 'asdfasdf',
      avatar: null, // Replace with an actual base64-encoded avatar string if needed
    })
    .set('Content-Type', 'application/json')

  if (response.status !== 201) {
    throw new Error('Failed to register test user')
  }

})


// Step-3: Tear down database connection
afterAll( async () => {
	await connection.close() 								// close mongose connection
	await mongo.stop()  										// stop mongodb server
})
*/