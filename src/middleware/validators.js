const Joi = require('joi');
const { ValidationError } = require('../utils/errors');

// Todo validation schema
const todoSchema = {
  create: Joi.object({
    title: Joi.string().required().trim().max(100).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title cannot exceed 100 characters',
      'any.required': 'Title is required'
    }),
    description: Joi.string().trim().allow('').max(500).messages({
      'string.max': 'Description cannot exceed 500 characters'
    })
  }),
  update: Joi.object({
    title: Joi.string().trim().max(100).messages({
      'string.empty': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 100 characters'
    }),
    description: Joi.string().trim().allow('').max(500).messages({
      'string.max': 'Description cannot exceed 500 characters'
    })
  })
};

/**
 * Validate request body against a schema
 * @param {Object} schema - Joi schema to validate against
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      
      return next(new ValidationError('Validation failed', details));
    }
    
    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validateTodoCreate: validateRequest(todoSchema.create),
  validateTodoUpdate: validateRequest(todoSchema.update)
};