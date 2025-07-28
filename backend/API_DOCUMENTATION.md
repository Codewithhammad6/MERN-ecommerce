# E-commerce API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": {
    "street": "456 New St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210"
  }
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=20&category=Electronics&minPrice=10&maxPrice=100&sortBy=price&sortOrder=asc
```

#### Get Featured Products
```http
GET /products/featured?limit=8
```

#### Get Products on Sale
```http
GET /products/sale?limit=8
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "brand": "Brand Name",
  "sku": "SKU-001",
  "isFeatured": true,
  "isOnSale": false,
  "images": [file1, file2, file3, file4]
}
```

#### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 45
}
```

#### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

### Orders

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "product_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "Credit Card",
  "notes": "Please deliver in the morning"
}
```

#### Get User Orders
```http
GET /orders/my-orders?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /orders/:id
Authorization: Bearer <token>
```

#### Update Order Status (Admin Only)
```http
PUT /orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Shipped",
  "trackingNumber": "TRK123456789",
  "shippingCarrier": "FedEx",
  "notes": "Package shipped via FedEx"
}
```

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

### Users

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+1234567890",
  "preferences": {
    "newsletter": true,
    "marketing": false
  }
}
```

#### Get User Orders
```http
GET /users/orders?page=1&limit=10
Authorization: Bearer <token>
```

#### Get User Statistics
```http
GET /users/stats
Authorization: Bearer <token>
```

### Admin

#### Get Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20&search=john&role=customer&status=active
Authorization: Bearer <admin_token>
```

#### Get Single User
```http
GET /admin/users/:id
Authorization: Bearer <admin_token>
```

#### Update User (Admin)
```http
PUT /admin/users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin",
  "status": "active"
}
```

#### Delete User (Admin)
```http
DELETE /admin/users/:id
Authorization: Bearer <admin_token>
```

#### Get All Orders (Admin)
```http
GET /admin/orders?page=1&limit=20&status=Processing&search=john
Authorization: Bearer <admin_token>
```

#### Get System Statistics
```http
GET /admin/stats
Authorization: Bearer <admin_token>
```

### Payments

#### Create Payment Intent
```http
POST /payments/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 149.99,
  "orderId": "order_id_here",
  "currency": "usd"
}
```

#### Confirm Payment
```http
POST /payments/confirm
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "orderId": "order_id_here"
}
```

#### Process Refund
```http
POST /payments/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "order_id_here",
  "amount": 50.00,
  "reason": "Customer requested refund"
}
```

#### Get Payment Methods
```http
GET /payments/methods
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Sample Data

### Admin User
```
Email: admin@example.com
Password: admin123
Role: admin
```

### Customer User
```
Email: john@example.com
Password: password123
Role: customer
```

## Testing the API

1. Start the server: `npm run dev`
2. Seed the database: `npm run seed`
3. Use tools like Postman or curl to test endpoints
4. Login with admin credentials to access admin endpoints
5. Login with customer credentials to test customer features

## File Upload

For product image uploads:
- Maximum 4 images per product
- Maximum file size: 5MB
- Supported formats: JPG, PNG, GIF
- Use `multipart/form-data` content type

## Pagination

Most list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

## Filtering

Product endpoints support filtering:
- `category`: Filter by category
- `minPrice`/`maxPrice`: Price range
- `minRating`: Minimum rating
- `inStock`: Only in-stock items
- `search`: Text search
- `sortBy`: Sort field (name, price, rating, newest, popular)
- `sortOrder`: Sort direction (asc, desc) 