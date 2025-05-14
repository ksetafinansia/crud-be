const express = require('express');
const router = express.Router();
const todoRoutes = require('./todo.routes');
const ApiResponse = require('../utils/apiResponse');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json(
    ApiResponse.success({
      service: 'Todo API Service',
      status: 'UP',
      timestamp: new Date().toISOString()
    }, 'Service is healthy')
  );
});

// API endpoints
router.use('/todos', todoRoutes);

module.exports = router;