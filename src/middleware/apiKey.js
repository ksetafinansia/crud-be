const { UnauthorizedError } = require('../utils/errors');

/**
 * API key authentication middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new UnauthorizedError('Invalid or missing API key'));
  }
  
  next();
};

module.exports = apiKeyAuth;