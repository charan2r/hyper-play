const joi = require('joi');

exports.registerCustomerSchema = joi.object({
  name: joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 100 characters'
  }),
  email: joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required'
  }),
  password: joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password is required'
  }),
  phone_number: joi.string().regex(/^\d{10}$/).required().messages({
    'string.pattern.base': 'Phone number must be 10 digits',
    'string.empty': 'Phone number is required'
  }),
  address: joi.string().max(500).allow('').messages({
    'string.max': 'Address must not exceed 500 characters'
  })
});

exports.loginSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required'
  }),
  password: joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});
