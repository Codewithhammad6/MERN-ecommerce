# ShopHub - Complete E-commerce Website

A modern, full-featured e-commerce website built with React, Tailwind CSS, and Zustand for state management. Includes a complete admin panel, order management, payment integration, and responsive design.

## 🚀 Features 

### Customer Features
- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product pages with reviews and ratings
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login/Register with demo credentials
- **Checkout Process**: Complete checkout with payment simulation
- **Order Management**: View order history and track status
- **User Profile**: Manage account information and preferences
- **Responsive Design**: Mobile-first responsive design

### Admin Features
- **Dashboard**: Analytics, statistics, and quick actions
- **Product Management**: CRUD operations for products
- **Order Management**: View and update order status
- **User Management**: Manage customer accounts and roles
- **Real-time Statistics**: Revenue, orders, and customer metrics

### Technical Features
- **State Management**: Zustand for global state
- **Routing**: React Router for navigation
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast for user feedback
- **Persistent Storage**: Local storage for cart and user data
- **Modern UI**: Tailwind CSS for styling

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Demo Credentials

### Admin Access
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Customer Access
- **Email**: `user@example.com`
- **Password**: `user123`

## 📱 Pages & Routes

### Customer Routes
- `/` - Home page with featured products
- `/products` - Product catalog with filters
- `/product/:id` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile management
- `/orders` - Order history
- `/order/:id` - Order details

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management

## 🎨 Features Overview

### Home Page
- Hero section with call-to-action
- Featured products showcase
- Category browsing
- Company features highlight

### Product Catalog
- Grid and list view options
- Advanced filtering (category, price, rating)
- Search functionality
- Responsive product cards

### Shopping Cart
- Add/remove items
- Quantity adjustment
- Real-time total calculation
- Persistent cart data

### Checkout Process
- Customer information form
- Shipping address
- Payment information (simulated)
- Order summary
- Secure checkout flow

### Admin Dashboard
- Revenue statistics
- Order metrics
- Top-selling products
- Recent orders
- Quick action buttons

### Product Management
- Add new products
- Edit existing products
- Delete products
- Stock management
- Category organization

### Order Management
- View all orders
- Update order status
- Order details modal
- Customer information
- Payment details

## 🔧 Customization

### Adding New Products
1. Navigate to `/admin/products`
2. Click "Add Product"
3. Fill in product details
4. Save the product

### Modifying Styles
- Edit `src/index.css` for global styles
- Use Tailwind CSS classes for component styling
- Custom CSS classes are defined in the CSS file

### State Management
- Store configuration: `src/store/store.js`
- Add new state slices as needed
- Use Zustand hooks for state access

## 📊 Data Structure

### Product Object
```javascript
{
  id: number,
  name: string,
  price: number,
  category: string,
  image: string,
  description: string,
  stock: number,
  rating: number,
  reviews: number
}
```

### Order Object
```javascript
{
  id: number,
  items: Array<Product>,
  customer: {
    name: string,
    email: string,
    phone: string,
    address: {
      street: string,
      city: string,
      state: string,
      zipCode: string
    }
  },
  payment: {
    method: string,
    last4: string
  },
  totals: {
    subtotal: number,
    tax: number,
    shipping: number,
    total: number
  },
  status: string,
  date: string
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Deploy automatically

## 🔮 Future Enhancements

- [ ] Real payment integration (Stripe/PayPal)
- [ ] User reviews and ratings system
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] PWA capabilities
- [ ] Real-time chat support
- [ ] Inventory management
- [ ] Discount/coupon system
- [ ] Shipping calculator
- [ ] Return/refund management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using React and Tailwind CSS**
