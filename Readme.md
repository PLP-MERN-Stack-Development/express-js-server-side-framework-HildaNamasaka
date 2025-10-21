# Express.js RESTful API - Product Management

A RESTful API built with Express.js implementing CRUD operations, middleware, error handling, and advanced features like filtering, pagination, and search.

## Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure `.env`:
```
PORT=3000
API_KEY=my-secret-api-key
```

## Running the Server

```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/api/products` | Get all products (supports filtering & pagination) |
| GET | `/api/products/:id` | Get product by ID |
| GET | `/api/products/search?q=query` | Search products |
| GET | `/api/products/stats` | Get product statistics |

### Protected Endpoints (Require API Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

**Authentication Header:**
```
x-api-key: my-secret-api-key
```

## Request Examples

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Filter by Category
```bash
curl "http://localhost:3000/api/products?category=Electronics"
```

### Pagination
```bash
curl "http://localhost:3000/api/products?page=1&limit=5"
```

### Search Products
```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model",
    "price": 699.99,
    "category": "Electronics",
    "inStock": true
  }'
```

### Update Product
```bash
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "x-api-key: my-secret-api-key" \
  -d '{"price": 649.99}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID \
  -H "x-api-key: my-secret-api-key"
```

## Product Resource Structure

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}
```

## Response Examples

### Success Response (GET /api/products)
```json
{
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "category": "Electronics",
      "inStock": true
    }
  ]
}
```

### Error Response
```json
{
  "error": {
    "name": "ValidationError",
    "message": "Name is required and must be a non-empty string",
    "statusCode": 400
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Authentication Error (Invalid API key) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Features

- RESTful CRUD operations
- Custom middleware (logger, authentication, validation)
- Custom error classes with proper HTTP status codes
- Filter by category and stock status
- Pagination support
- Search functionality
- Product statistics

## Project Structure

```
├── server.js           # Main server file
├── routes.js           # API routes
├── middleware.js       # Custom middleware & error handlers
├── .env               # Environment variables
└── package.json       # Dependencies
```

## Dependencies

- express
- uuid
- dotenv