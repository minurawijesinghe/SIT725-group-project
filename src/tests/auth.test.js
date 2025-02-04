const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const configureApp = require('../config/app');
const User = require('../models/User');

jest.setTimeout(30000);  // 30 seconds timeout

process.env.JWT_SECRET = 'test-secret-key';

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  app = configureApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', validUser.email);
      expect(response.body.user).toHaveProperty('name', validUser.name);
    //   expect(response.body.user).not.toHaveProperty('password');
    }, 30000);

    it('should not register user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Attempt to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not register user with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    //   expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });
});
