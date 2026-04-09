const joi = require("joi");

exports.addProductSchema = joi.object({
  name: joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
    "string.max": "Product name must not exceed 100 characters",
  }),
  description: joi.string().max(1000).required().messages({
    "string.empty": "Description is required",
    "string.max": "Description must not exceed 1000 characters",
  }),
  price: joi.number().positive().required().messages({
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  category: joi.string().max(50).required().messages({
    "string.empty": "Category is required",
    "string.max": "Category must not exceed 50 characters",
  }),
  sport: joi.string().max(50).required().messages({
    "string.empty": "Sport type is required",
    "string.max": "Sport must not exceed 50 characters",
  }),
  status: joi.string().valid("active", "inactive").default("active"),
  stock: joi.number().integer().min(0).default(0).messages({
    "number.min": "Stock cannot be negative",
  }),
});

exports.updateProductSchema = joi
  .object({
    name: joi.string().min(2).max(100).messages({
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name must not exceed 100 characters",
    }),
    description: joi.string().max(1000).messages({
      "string.max": "Description must not exceed 1000 characters",
    }),
    price: joi.number().positive().messages({
      "number.positive": "Price must be a positive number",
    }),
    category: joi.string().max(50).messages({
      "string.max": "Category must not exceed 50 characters",
    }),
    sport: joi.string().max(50).messages({
      "string.max": "Sport must not exceed 50 characters",
    }),
    status: joi.string().valid("active", "inactive"),
    stock: joi.number().integer().min(0).messages({
      "number.min": "Stock cannot be negative",
    }),
  })
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
