const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
  NotFoundError,
  ValidationError,
  authenticate,
  validateProduct,
  validateProductUpdate,
  asyncHandler
} = require('./middleware');

// In-memory data storage
let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Coffee Maker',
    description: 'Automatic coffee maker',
    price: 79.99,
    category: 'Appliances',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Desk Chair',
    description: 'Ergonomic office chair',
    price: 249.99,
    category: 'Furniture',
    inStock: false
  }
];

// Get product statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
    byCategory: {}
  };

  products.forEach(p => {
    if (!stats.byCategory[p.category]) {
      stats.byCategory[p.category] = 0;
    }
    stats.byCategory[p.category]++;
  });

  res.json(stats);
}));

// Search products by name
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ValidationError('Search query parameter "q" is required');
  }

  const results = products.filter(
    p => p.name.toLowerCase().includes(q.toLowerCase()) ||
         p.description.toLowerCase().includes(q.toLowerCase())
  );

  res.json({
    query: q,
    count: results.length,
    data: results
  });
}));

// Get all products with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const { category, inStock, search, page = 1, limit = 10 } = req.query;
  
  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by stock status
  if (inStock !== undefined) {
    const stockStatus = inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === stockStatus);
  }

  // Search by name
  if (search) {
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    total: filteredProducts.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filteredProducts.length / limitNum),
    data: paginatedProducts
  });
}));

// Get a specific product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }

  res.json(product);
}));

// Create a new product
router.post('/', authenticate, validateProduct, asyncHandler(async (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    inStock: req.body.inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
}));

// Update an existing product
router.put('/:id', authenticate, validateProductUpdate, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }

  const updatedProduct = {
    ...products[productIndex],
    ...req.body
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
}));

// Delete a product
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);

  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${req.params.id} not found`);
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deletedProduct });
}));

module.exports = router;