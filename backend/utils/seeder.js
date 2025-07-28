const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-canceling wireless headphones with 30-hour battery life and crystal clear sound quality.",
    price: 199.99,
    salePrice: 149.99,
    category: "Electronics",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400"
    ],
    brand: "AudioTech",
    sku: "ATH-001",
    weight: 0.25,
    dimensions: "18x8x3",
    features: "Noise Cancellation, 30h Battery, Quick Charge, Touch Controls",
    tags: ["wireless", "bluetooth", "headphones", "audio"],
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 25,
    rating: 4.8,
    reviews: 156
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
    price: 299.99,
    category: "Electronics",
    stock: 32,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400"
    ],
    brand: "FitTech",
    sku: "FTW-002",
    weight: 0.05,
    dimensions: "4x4x1",
    features: "Heart Rate Monitor, GPS, Water Resistant, Sleep Tracking",
    tags: ["fitness", "watch", "smartwatch", "health"],
    isFeatured: true,
    isOnSale: false,
    rating: 4.6,
    reviews: 89
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    salePrice: 19.99,
    category: "Fashion & Apparel",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400"
    ],
    brand: "EcoWear",
    sku: "ECT-003",
    weight: 0.15,
    dimensions: "30x25x2",
    features: "100% Organic Cotton, Breathable, Sustainable, Multiple Colors",
    tags: ["organic", "cotton", "t-shirt", "sustainable"],
    isFeatured: false,
    isOnSale: true,
    discountPercentage: 33,
    rating: 4.4,
    reviews: 234
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 39.99,
    category: "Home & Garden",
    stock: 78,
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400"
    ],
    brand: "HydroLife",
    sku: "HSB-004",
    weight: 0.4,
    dimensions: "8x3x3",
    features: "24h Cold, 12h Hot, BPA Free, Leak Proof",
    tags: ["water bottle", "insulated", "stainless steel", "eco-friendly"],
    isFeatured: false,
    isOnSale: false,
    rating: 4.7,
    reviews: 189
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip yoga mat made from eco-friendly materials with alignment lines for perfect poses.",
    price: 79.99,
    salePrice: 59.99,
    category: "Sports & Outdoors",
    stock: 56,
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    ],
    brand: "ZenFlow",
    sku: "ZYM-005",
    weight: 1.2,
    dimensions: "183x61x0.6",
    features: "Non-slip Surface, Alignment Lines, Eco-friendly, 6mm Thick",
    tags: ["yoga", "mat", "fitness", "meditation"],
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 25,
    rating: 4.9,
    reviews: 312
  },
  {
    name: "Natural Face Cream",
    description: "Hydrating face cream with natural ingredients for all skin types.",
    price: 24.99,
    category: "Beauty & Personal Care",
    stock: 95,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"
    ],
    brand: "PureGlow",
    sku: "PFC-006",
    weight: 0.1,
    dimensions: "6x6x3",
    features: "Natural Ingredients, Hydrating, All Skin Types, Fragrance Free",
    tags: ["face cream", "natural", "skincare", "hydrating"],
    isFeatured: false,
    isOnSale: false,
    rating: 4.5,
    reviews: 178
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-performance wireless gaming mouse with RGB lighting and programmable buttons.",
    price: 89.99,
    salePrice: 69.99,
    category: "Electronics",
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?w=400"
    ],
    brand: "GameTech",
    sku: "GTM-007",
    weight: 0.12,
    dimensions: "12x6x4",
    features: "RGB Lighting, Programmable Buttons, 25K DPI, Wireless",
    tags: ["gaming", "mouse", "wireless", "rgb"],
    isFeatured: true,
    isOnSale: true,
    discountPercentage: 22,
    rating: 4.6,
    reviews: 145
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 beautiful ceramic coffee mugs perfect for home or office use.",
    price: 34.99,
    category: "Home & Garden",
    stock: 67,
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    brand: "HomeStyle",
    sku: "HCM-008",
    weight: 0.8,
    dimensions: "12x12x8",
    features: "Microwave Safe, Dishwasher Safe, Lead Free, Set of 4",
    tags: ["coffee mug", "ceramic", "kitchen", "home"],
    isFeatured: false,
    isOnSale: false,
    rating: 4.3,
    reviews: 92
  }
];

// Sample users data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Admin St",
      city: "Admin City",
      state: "AC",
      zipCode: "12345"
    },
    status: "active"
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 Customer Ave",
      city: "Customer City",
      state: "CC",
      zipCode: "67890"
    },
    status: "active"
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 (555) 456-7890",
    address: {
      street: "789 User Blvd",
      city: "User Town",
      state: "UT",
      zipCode: "11111"
    },
    status: "active"
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    console.log(`Seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed products
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`Created product: ${product.name}`);
    }

    console.log(`Seeded ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Main seeder function
const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Starting data seeding...');
    
    // Seed users first
    await seedUsers();
    
    // Seed products
    await seedProducts();
    
    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, seedUsers, seedProducts }; 