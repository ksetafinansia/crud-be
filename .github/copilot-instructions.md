# Technical Specification: Node.js CRUD API with MongoDB on Railway

## 1. Project Overview

This document outlines the technical specification for developing a secure CRUD (Create, Read, Update, Delete) API using Node.js and Express with MongoDB as the database and Railway.app as the deployment platform.

### 1.1 Objectives

- Create a secure, scalable RESTful API
- Implement API key authentication
- Follow industry best practices for code organization and API design
- Deploy the application on Railway.app
- Connect to MongoDB Atlas for data persistence

### 1.2 Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom API key middleware
- **Deployment**: Railway.app
- **Environment Management**: dotenv
- **Validation**: Joi or express-validator
- **Error Handling**: Custom error handling middleware
- **Logging**: Winston or Morgan

## 2. Project Structure

```
project-root/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection configuration
│   │   ├── environment.js     # Environment variables management
│   │   └── logger.js          # Logging configuration
│   ├── controllers/
│   │   └── resource.controller.js  # Request handlers for your resource
│   ├── middleware/
│   │   ├── apiKey.js          # API key authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validators.js      # Request validation middleware
│   ├── models/
│   │   └── resource.model.js  # Mongoose schema and model
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   └── resource.routes.js # Routes for your resource
│   ├── services/
│   │   └── resource.service.js # Business logic
│   ├── utils/
│   │   ├── apiResponse.js     # Standard API response formatter
│   │   └── errors.js          # Custom error classes
│   └── app.js                 # Express application setup
├── .env                       # Environment variables (gitignored)
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 3. API Design

### 3.1 API Endpoints

Based on best practices for RESTful API design:

| Method | Endpoint                  | Description                   | Request Body             | Response                    |
|--------|---------------------------|-------------------------------|--------------------------|------------------------------|
| GET    | /api/v1/resources         | List all resources            | N/A                      | Array of resource objects    |
| GET    | /api/v1/resources/:id     | Get a specific resource       | N/A                      | Resource object              |
| POST   | /api/v1/resources         | Create a new resource         | Resource object          | Created resource             |
| PUT    | /api/v1/resources/:id     | Update a resource completely  | Complete resource object | Updated resource             |
| PATCH  | /api/v1/resources/:id     | Update resource partially     | Partial resource object  | Updated resource             |
| DELETE | /api/v1/resources/:id     | Delete a resource             | N/A                      | Success message              |

### 3.2 URL Path Conventions

- Use kebab-case for paths: `/api/v1/resource-types`
- Include API versioning: `/api/v1/`
- Use plural nouns for resource collections: `/resources` not `/resource`
- Use resource identifiers for specific items: `/resources/:id`
- Use nested resources when representing relationships: `/resources/:id/sub-resources`

### 3.3 Request & Response Standards

#### Request Format

```json
// POST /api/v1/resources
{
  "name": "Resource Name",
  "description": "Resource description",
  "attributes": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

#### Response Format

All API responses should follow a consistent structure:

```json
{
  "success": true,
  "status": 200,
  "data": {
    // Resource data here
  },
  "message": "Operation successful"
}
```

For errors:

```json
{
  "success": false,
  "status": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

### 3.4 HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **204 No Content**: Successful deletion
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing or invalid API key
- **403 Forbidden**: Valid API key but insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side error

## 4. Authentication & Security

### 4.1 API Key Authentication

Implement API key authentication using custom middleware:

```javascript
// Example implementation
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      status: 401,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key'
      }
    });
  }
  
  next();
};
```

### 4.2 Security Best Practices

- Store API keys in environment variables, never in code
- Set secure HTTP headers:
  - Helmet.js for security headers
  - CORS configuration to restrict origins
- Rate limiting to prevent abuse
- Validate and sanitize all input
- Use HTTPS in production
- Implement proper error handling that doesn't leak sensitive information

## 5. Database Design

### 5.1 MongoDB Connection

```javascript
// config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 5.2 Sample Mongoose Schema

```javascript
// models/resource.model.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
```

## 6. Node.js Clean Code Best Practices

### 6.1 General Principles

1. **Follow single responsibility principle**: Each module, class, and function should have one responsibility
2. **DRY (Don't Repeat Yourself)**: Avoid code duplication
3. **KISS (Keep It Simple, Stupid)**: Write simple, readable code
4. **Use async/await** over callbacks or Promise chains
5. **Error handling**: Always handle errors appropriately

### 6.2 Code Style & Organization

1. **Use ESLint and Prettier**: Enforce consistent code style
2. **Use meaningful names**: Variables, functions, and classes should have descriptive names
3. **Function length**: Keep functions small (< 25 lines ideally)
4. **Comment only when necessary**: Code should be self-explanatory; comment complex logic
5. **Use constants** for magic values and configuration
6. **Follow the folder structure** outlined in section 2

### 6.3 Asynchronous Code

```javascript
// Correct way to handle async operations
const getResource = async (id) => {
  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      throw new NotFoundError('Resource not found');
    }
    return resource;
  } catch (error) {
    if (error.name === 'CastError') {
      throw new BadRequestError('Invalid ID format');
    }
    throw error; // Re-throw other errors
  }
};
```

### 6.4 Error Handling

```javascript
// error middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error for internal tracking but don't expose sensitive details
  console.error(err.stack);
  
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: statusCode === 500 ? 'Internal server error' : err.message,
      details: err.details || null
    }
  });
};
```

### 6.5 Environment Variables

```javascript
// config/environment.js
require('dotenv').config();

const requiredEnvVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'API_KEY'];

// Validate required environment variables
requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    console.error(`Error: Environment variable ${env} is required`);
    process.exit(1);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  apiKey: process.env.API_KEY
};
```

## 7. Deployment on Railway.app

### 7.1 Prerequisites

1. GitHub account
2. Railway.app account
3. MongoDB Atlas account

### 7.2 MongoDB Atlas Setup

1. Create a free MongoDB Atlas cluster
2. Set up database access user and password
3. Configure network access (IP whitelist)
4. Get your MongoDB connection string

### 7.3 Railway.app Deployment Steps

1. Push your code to a GitHub repository
2. Log in to Railway.app with your GitHub account
3. Create a new project from your GitHub repository
4. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>`
   - `API_KEY=your-secure-api-key`
5. Deploy the application

### 7.4 Configuration

Railway.app auto-detects Node.js projects and will:
1. Install dependencies from package.json
2. Run the start script defined in package.json

Ensure your package.json has:

```json
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}
```

### 7.5 Continuous Deployment

Railway.app automatically deploys when changes are pushed to your GitHub repository. To manage this:

1. Configure branch deployments in Railway settings
2. Set up automatic deployments for the main/master branch

## 8. Testing Strategy

### 8.1 Unit Testing

Use Jest or Mocha with Chai for:
- Controller functions
- Service layer functions
- Middleware

### 8.2 Integration Testing

Test the API endpoints with a test database:
- Use Supertest for HTTP assertions
- MongoDB Memory Server for database tests

### 8.3 Example Test Setup

```javascript
// tests/controllers/resource.controller.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Resource Controller', () => {
  test('GET /api/v1/resources should return empty array initially', async () => {
    const response = await request(app)
      .get('/api/v1/resources')
      .set('x-api-key', process.env.API_KEY);
      
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(0);
  });
});
```

## 9. Performance Considerations

1. **Connection Pooling**: Configure MongoDB connection pools appropriately
2. **Indexing**: Create proper indexes on frequently queried fields
3. **Pagination**: Implement pagination for list endpoints
4. **Caching**: Consider adding Redis for caching frequent queries
5. **Compression**: Use compression middleware to reduce payload size
6. **Payload Size**: Limit request body size to prevent abuse

## 10. Monitoring & Logging

### 10.1 Logging

Use Winston for structured logging:

```javascript
// config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;
```

### 10.2 Health Check Endpoint

```javascript
// routes/index.js
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 200,
    data: {
      service: 'API Service',
      status: 'UP',
      timestamp: new Date().toISOString()
    }
  });
});
```

## 11. Implementation Plan

### Phase 1: Basic Setup
- Project structure and environment setup
- Express application configuration
- MongoDB connection
- Basic error handling

### Phase 2: Core Functionality
- API key authentication middleware
- Resource model definition
- CRUD routes and controllers
- Request validation

### Phase 3: Refinement
- Comprehensive error handling
- Logging implementation
- Testing
- Documentation

### Phase 4: Deployment
- MongoDB Atlas setup
- Railway.app deployment
- Environment configuration

## 12. Conclusion

This technical specification provides a comprehensive guide for building a secure, maintainable Node.js CRUD API with MongoDB deployment on Railway.app. Following these guidelines will ensure a scalable application architecture that adheres to industry best practices.

The implementation focuses on:
- Clean code principles
- Secure API design
- Proper error handling
- Consistent request/response patterns
- Simplified deployment

By following this specification, developers will create a robust foundation that can be extended with additional features as needed.
