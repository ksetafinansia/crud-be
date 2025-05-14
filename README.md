# Todo API

A RESTful CRUD API for managing todos, built with Node.js, Express, and MongoDB.

## Features

- RESTful API design with proper HTTP methods and status codes
- MongoDB integration with Mongoose ODM
- API key authentication
- Input validation with Joi
- Error handling middleware
- Standardized API responses
- Security features (CORS, Helmet, Rate Limiting)
- Environment configuration
- Logging with Winston

## Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/ksetafinansia/crud-be.git
cd crud-be
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/todo-api
API_KEY=your-secure-api-key
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## API Endpoints

| Method | Endpoint          | Description           | Auth Required |
|--------|-------------------|-----------------------|--------------|
| GET    | /api/v1/health    | Health check          | No           |
| GET    | /api/v1/todos     | Get all todos         | Yes          |
| GET    | /api/v1/todos/:id | Get a specific todo   | Yes          |
| POST   | /api/v1/todos     | Create a new todo     | Yes          |
| PUT    | /api/v1/todos/:id | Update a todo fully   | Yes          |
| PATCH  | /api/v1/todos/:id | Update a todo partially | Yes        |
| DELETE | /api/v1/todos/:id | Delete a todo         | Yes          |

## Authentication

The API uses API key authentication. Include the API key in the request header:

```
X-API-Key: your-api-key
```

## Request & Response Examples

### GET /api/v1/todos

Response:
```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Buy groceries",
      "description": "Need milk, eggs, and bread",
      "createdAt": "2023-06-22T18:30:00.000Z",
      "updatedAt": "2023-06-22T18:30:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "title": "Finish project",
      "description": "Complete the backend API",
      "createdAt": "2023-06-22T19:00:00.000Z",
      "updatedAt": "2023-06-22T19:00:00.000Z"
    }
  ],
  "message": "Todos retrieved successfully"
}
```

### POST /api/v1/todos

Request:
```json
{
  "title": "Learn Node.js",
  "description": "Study Express, MongoDB, and authentication"
}
```

Response:
```json
{
  "success": true,
  "status": 201,
  "data": {
    "_id": "60d21b4667d0d8992e610c87",
    "title": "Learn Node.js",
    "description": "Study Express, MongoDB, and authentication",
    "createdAt": "2023-06-23T10:15:00.000Z",
    "updatedAt": "2023-06-23T10:15:00.000Z"
  },
  "message": "Todo created successfully"
}
```

## Error Handling

All errors follow a standard format:

```json
{
  "success": false,
  "status": 404,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo not found",
    "details": null
  }
}
```

## Deployment

This API can be deployed on Railway.app by linking your GitHub repository and configuring the environment variables mentioned above.

## License

ISC