import request from 'supertest'
import { app } from '@/app' 
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connect, connection } from 'mongoose'

// Mock the fileService module
jest.mock('@/services/fileService', () => ({
  uploadFile: jest.fn().mockResolvedValue({
    error: null,
    image: { secure_url: 'mocked_avatar_url' },
  }),
  removeFile: jest.fn(),
}))

const mongo = new MongoMemoryServer()

// Database setup for testing
beforeAll(async () => {
  await mongo.start()
  const mongoUri = mongo.getUri()
  await connect(mongoUri)
})

// Cleanup after each test
afterAll(async () => {
  await connection.close()
  await mongo.stop()
})

describe('POST /api/auth/register', () => {
  it('should register a user successfully', async () => {
    // Arrange
    const registerData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      avatar: null, // No avatar for this test case (or provide a base64 string)
    }

    // Act
    const response = await request(app)
      .post('/api/auth/register')
      .send(registerData)
      .set('Content-Type', 'application/json')

    // Assert
    expect(response.status).toBe(201)
    expect(response.body.status).toBe('success')
    expect(response.body.data).toHaveProperty('_id')
    expect(response.body.data.email).toBe('testuser@example.com')
    expect(response.body.data.name).toBe('test user') 		// schema converts to lowercase
  })

  it('should fail when email is already registerted', async () => {
    // Register the first user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Existing User',
        email: 'testuser@example.com',
        password: 'password123',
        avatar: null,
      })
      .set('Content-Type', 'application/json')

    // Try to register the same email again
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        avatar: null,
      })
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('This email already registerted')
  })
})
