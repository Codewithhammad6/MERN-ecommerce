#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up E-commerce Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Shipping Configuration
SHIPPING_FREE_THRESHOLD=50
SHIPPING_COST=5.99
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the .env file with your actual configuration values.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

// Create uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsPath);
  console.log('✅ Uploads directory created successfully!\n');
} else {
  console.log('✅ Uploads directory already exists.\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check if MongoDB is running
console.log('🔍 Checking MongoDB connection...');
try {
  // Try to connect to MongoDB
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection.once('open', () => {
    console.log('✅ MongoDB is running and accessible!\n');
    mongoose.connection.close();
    
    // Seed the database
    console.log('🌱 Seeding database with sample data...');
    try {
      execSync('npm run seed', { stdio: 'inherit' });
      console.log('✅ Database seeded successfully!\n');
    } catch (error) {
      console.error('❌ Error seeding database:', error.message);
    }
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update the .env file with your actual configuration');
    console.log('2. Start the server: npm run dev');
    console.log('3. Test the API: http://localhost:5000/api/health');
    console.log('\n🔑 Default credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: john@example.com / password123');
    console.log('\n📚 API Documentation: API_DOCUMENTATION.md');
  });
  
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n💡 Please make sure MongoDB is running:');
    console.log('   - Install MongoDB if not already installed');
    console.log('   - Start MongoDB service');
    console.log('   - Or use MongoDB Atlas (cloud)');
    process.exit(1);
  });
  
} catch (error) {
  console.error('❌ Error checking MongoDB:', error.message);
  process.exit(1);
} 