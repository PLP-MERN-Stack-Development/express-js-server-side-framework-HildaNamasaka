// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

// Logger Middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Authentication Middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY || 'my-secret-api-key';
  
  if (!apiKey || apiKey !== validApiKey) {
    return next(new AuthenticationError('Invalid or missing API key'));
  }
  
  next();
};

// Validation Middleware for Product Creation
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('Description is required and must be a non-empty string');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a non-negative number');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required and must be a non-empty string');
  }

  if (inStock === undefined || typeof inStock !== 'boolean') {
    errors.push('inStock is required and must be a boolean');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join('; ')));
  }

  next();
};

// Validation Middleware for Product Update
const validateProductUpdate = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push('Name must be a non-empty string');
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    errors.push('Description must be a non-empty string');
  }

  if (price !== undefined && (typeof price !== 'number' || price < 0)) {
    errors.push('Price must be a non-negative number');
  }

  if (category !== undefined && (typeof category !== 'string' || category.trim() === '')) {
    errors.push('Category must be a non-empty string');
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean');
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join('; ')));
  }

  next();
};

// Async Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 Handler
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      name: err.name,
      message: message,
      statusCode: statusCode
    }
  });
};

module.exports = {
  NotFoundError,
  ValidationError,
  AuthenticationError,
  logger,
  authenticate,
  validateProduct,
  validateProductUpdate,
  asyncHandler,
  notFoundHandler,
  errorHandler
};