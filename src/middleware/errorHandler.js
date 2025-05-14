const ApiResponse = require('../utils/apiResponse');
const logger = require('../config/logger');
const { AppError } = require('../utils/errors');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal Server Error';
  let errorCode = err.code || 'SERVER_ERROR';
  let details = err.details || null;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    errorMessage = 'Validation Error';
    details = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    errorMessage = 'Invalid ID format';
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY';
    errorMessage = 'Duplicate key error';
    const field = Object.keys(err.keyValue)[0];
    details = `The ${field} already exists`;
  }

  // Send standardized error response
  const response = ApiResponse.error(
    errorMessage,
    statusCode,
    errorCode,
    details
  );

  res.status(statusCode).json(response);
};

module.exports = errorHandler;