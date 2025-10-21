const express = require('express');
require('dotenv').config();

const productRoutes = require('./routes');
const { logger, notFoundHandler, errorHandler } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.use('/api/products', productRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;