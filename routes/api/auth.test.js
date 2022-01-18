const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
require('dotenv').config()

const { User } = require('../../model/user')
const { DB_TEST_HOST } = process.env

describe('test auth', () => {
  let server
  beforeAll(() => (server = app.listen(3000)))
  afterAll(() => server.close())

  beforeEach((done) => {
    mongoose.connect(DB_TEST_HOST).then(() => done())
  })

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    })
  })
  test('test register rout', () => {
    const registerData = {
      email: 'Test1@ukr.net',
      password: '123123',
    }
    const response = await request(app)
      .post('/api/auth/register')
      .send(registerData)

    // check response
    expect(response.statusCode).toBe(201)
    expect(response.body.message).toBe('Register success')

    // check data in database
    const user = await User.findById(response.body._id)
    expect(user).toByThruthy()
    expect(user.email).toBe(registerData.email)
  })
})
