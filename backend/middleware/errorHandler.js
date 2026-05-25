class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Validation errors from Joi
  if (err.isJoi || err.details) {
    err.statusCode = 400;
    const details = err.details?.map((detail) => detail.message) || [];
    return res.status(err.statusCode).json({
      success: false,
      error: "Validation failed",
      details,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Token expired";
  }

  // Stripe errors
  if (err.type?.includes("stripe")) {
    err.statusCode = 400;
  }

  // Standard error response
  const errorResponse = {
    success: false,
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  res.status(err.statusCode).json(errorResponse);
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, AppError, catchAsync };
