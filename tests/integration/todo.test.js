const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Todo = require('../../src/models/todo.model');

// Mock the environment and API key
process.env.API_KEY = 'test-api-key';
process.env.NODE_ENV = 'test';

// Import app after setting env variables
const app = require('../../src/app');

let mongoServer;

beforeAll(async () => {
  // Set up an in-memory MongoDB server for testing
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  
  // Disconnect any existing connections
  await mongoose.disconnect();
  
  // Connect to the in-memory database
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  // Clean up after tests
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the Todo collection before each test
  await Todo.deleteMany({});
});

describe('Todo API Endpoints', () => {
  // Test sample todo data
  const sampleTodo = {
    title: 'Test Todo',
    description: 'This is a test todo item'
  };

  // GET /api/v1/todos - Should return empty array initially
  test('GET /api/v1/todos should return empty array initially', async () => {
    const response = await request(app)
      .get('/api/v1/todos')
      .set('X-API-Key', process.env.API_KEY);
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(0);
  });

  // POST /api/v1/todos - Should create a new todo
  test('POST /api/v1/todos should create a new todo', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .set('X-API-Key', process.env.API_KEY)
      .send(sampleTodo);
      
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toBe(sampleTodo.title);
    expect(response.body.data.description).toBe(sampleTodo.description);
  });

  // Test Todo CRUD workflow
  test('Should perform full CRUD workflow', async () => {
    // Create a todo
    const createResponse = await request(app)
      .post('/api/v1/todos')
      .set('X-API-Key', process.env.API_KEY)
      .send(sampleTodo);
      
    const todoId = createResponse.body.data._id;
    
    // Get the created todo
    const getResponse = await request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set('X-API-Key', process.env.API_KEY);
      
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data._id).toBe(todoId);
    
    // Update the todo
    const updateResponse = await request(app)
      .put(`/api/v1/todos/${todoId}`)
      .set('X-API-Key', process.env.API_KEY)
      .send({
        title: 'Updated Todo',
        description: 'This todo has been updated'
      });
      
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.title).toBe('Updated Todo');
    expect(updateResponse.body.data.description).toBe('This todo has been updated');
    
    // Delete the todo
    const deleteResponse = await request(app)
      .delete(`/api/v1/todos/${todoId}`)
      .set('X-API-Key', process.env.API_KEY);
      
    expect(deleteResponse.status).toBe(200);
    
    // Verify deletion
    const verifyResponse = await request(app)
      .get(`/api/v1/todos/${todoId}`)
      .set('X-API-Key', process.env.API_KEY);
      
    expect(verifyResponse.status).toBe(404);
  });

  // Test validation
  test('Should return validation error for invalid todo data', async () => {
    const response = await request(app)
      .post('/api/v1/todos')
      .set('X-API-Key', process.env.API_KEY)
      .send({ description: 'Missing title' });
      
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  // Test API key authentication
  test('Should reject requests without valid API key', async () => {
    const response = await request(app).get('/api/v1/todos');
    expect(response.status).toBe(401);
    
    const badKeyResponse = await request(app)
      .get('/api/v1/todos')
      .set('X-API-Key', 'invalid-key');
      
    expect(badKeyResponse.status).toBe(401);
  });
});