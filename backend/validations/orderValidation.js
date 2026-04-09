const joi = require("joi");

exports.createOrderSchema = joi.object({
  cartItems: joi
    .array()
    .items(
      joi.object({
        product_id: joi.number().integer().required().messages({
          "number.base": "Product ID must be a number",
          "any.required": "Product ID is required",
        }),
        quantity: joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number",
          "number.min": "Quantity must be at least 1",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Cart must contain at least one item",
      "any.required": "CartItems are required",
    }),
  customerInfo: joi
    .object({
      firstName: joi.string().min(2).max(50).required().messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters",
      }),
      lastName: joi.string().min(2).max(50),
      email: joi.string().email().required().messages({
        "string.email": "Email must be valid",
        "string.empty": "Email is required",
      }),
      phone: joi
        .string()
        .regex(/^\d{10}$/)
        .messages({
          "string.pattern.base": "Phone must be 10 digits",
        }),
      address: joi.string().max(500),
      city: joi.string().max(50),
      country: joi.string().max(50),
    })
    .required()
    .messages({
      "any.required": "Customer information is required",
    }),
});

exports.paymentIntentSchema = joi.object({
  amount: joi.number().positive().required().messages({
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),
  currency: joi.string().length(3).required().messages({
    "string.length": "Currency must be a 3-letter code",
    "any.required": "Currency is required",
  }),
});
