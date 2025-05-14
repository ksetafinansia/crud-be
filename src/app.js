const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { nodeEnv, port } = require('./config/environment');
const connectDB = require('./config/database');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const apiKeyAuth = require('./middleware/apiKey');
const logger = require('./config/logger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    status: 429,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes with API key authentication
app.use('/api/v1', apiKeyAuth, apiRoutes);

// 404 handler for undefined routes
app.all('/*', (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    }
  });
});

// Global error handler
app.use(errorHandler);

// Start server only if this file is run directly (not imported for tests)
if (require.main === module) {
  const PORT = port || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running in ${nodeEnv} mode on port ${PORT}`);
  });
}

// For testing purposes
module.exports = app;