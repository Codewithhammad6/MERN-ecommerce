# E-commerce Backend API

A complete RESTful API for an e-commerce platform built with Express.js, MongoDB, and Node.js.

## Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Role-based access control (Admin/Customer)
- Password reset functionality
- Email verification (ready for implementation)

### 🛍️ Product Management
- CRUD operations for products
- Product categories and filtering
- Image upload support
- Stock management
- Featured products and sales
- Product search and pagination

### 👥 User Management
- User profiles and preferences
- Address management
- Order history
- User statistics

### 📦 Order Management
- Order creation and processing
- Order status tracking
- Shipping and delivery management
- Order cancellation and refunds
- Order statistics and analytics

### 💳 Payment Processing
- Stripe integration
- Payment intent creation
- Payment confirmation
- Refund processing
- Webhook handling

### 🏪 Admin Dashboard
- Comprehensive admin panel
- User management
- Product management
- Order management
- Sales analytics and reporting
- System statistics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **Payment**: Stripe
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/ecommerce

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Shipping Configuration
   SHIPPING_FREE_THRESHOLD=50
   SHIPPING_COST=5.99
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:resetToken` - Reset password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/sale` - Get products on sale
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories` - Get product categories
- `PATCH /api/products/:id/stock` - Update product stock (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/refund` - Process refund (Admin only)
- `GET /api/orders/track/:trackingNumber` - Track order
- `GET /api/orders/stats` - Get order statistics (Admin only)
- `GET /api/orders/revenue` - Get revenue by date range (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user orders
- `GET /api/users/orders/:id` - Get user order by ID
- `PUT /api/users/orders/:id/cancel` - Cancel user order
- `GET /api/users/stats` - Get user statistics

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/stats` - Get system statistics

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/webhook` - Stripe webhook

## Database Models

### User Model
- Basic info (name, email, password)
- Role-based access (customer/admin)
- Address and contact information
- Account status and preferences
- Email verification and password reset

### Product Model
- Product details (name, description, price)
- Categories and tags
- Stock management
- Images and specifications
- Sale and featured status
- SEO information

### Order Model
- Order items and quantities
- Shipping address
- Payment information
- Order status tracking
- Delivery and tracking
- Refund management

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for data validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Data Sanitization**: Protection against injection attacks

## Error Handling

- Centralized error handling middleware
- Custom error classes
- Validation error responses
- Proper HTTP status codes
- Detailed error logging

## File Upload

- Image upload support for products
- File size and type validation
- Multiple image upload
- Cloud storage ready (Cloudinary integration available)

## Payment Integration

- Stripe payment processing
- Payment intent creation
- Webhook handling
- Refund processing
- Multiple payment methods support

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Environment Variables
All configuration is done through environment variables. See `env.example` for required variables.

### Database
The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running before starting the application.

### API Documentation
The API follows RESTful conventions and returns JSON responses. All endpoints include proper error handling and validation.

## Deployment

1. Set up environment variables for production
2. Configure MongoDB connection string
3. Set up Stripe keys for production
4. Configure CORS origins for your frontend domain
5. Set up proper logging and monitoring
6. Use a process manager like PM2 for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository. 