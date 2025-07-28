const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: [
      'Electronics',
      'Fashion & Apparel',
      'Home & Garden',
      'Sports & Outdoors',
      'Beauty & Personal Care',
      'Books & Media',
      'Toys & Games',
      'Automotive',
      'Health & Wellness',
      'Food & Beverages',
      'Jewelry & Accessories',
      'Pet Supplies',
      'Office & Business',
      'Baby & Kids',
      'Art & Crafts',
      'Music & Instruments',
      'Tools & Hardware',
      'Travel & Luggage',
      'Phones & Accessories',
      'Computers & Laptops'
    ]
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one product image']
  }],
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    trim: true
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    type: String,
    trim: true
  },
  features: {
    type: String,
    maxlength: [1000, 'Features cannot be more than 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100%']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: [0, 'Review count cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  variants: [{
    name: String,
    options: [String],
    price: Number
  }],
  specifications: {
    type: Map,
    of: String
  },
  shipping: {
    weight: Number,
    dimensions: String,
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    }
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isOnSale: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for current price (sale price if available, otherwise regular price)
productSchema.virtual('currentPrice').get(function() {
  return this.salePrice || this.price;
});

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  if (!this.salePrice || this.salePrice >= this.price) return 0;
  return this.price - this.salePrice;
});

// Virtual for discount percentage
productSchema.virtual('calculatedDiscountPercentage').get(function() {
  if (!this.salePrice || this.salePrice >= this.price) return 0;
  return Math.round(((this.price - this.salePrice) / this.price) * 100);
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0 && this.status === 'active';
});

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
  this.stock = Math.max(0, this.stock - quantity);
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  }
  return this.save();
};

// Method to add stock
productSchema.methods.addStock = function(quantity) {
  this.stock += quantity;
  if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ 
    isFeatured: true, 
    status: 'active' 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Static method to get products on sale
productSchema.statics.getOnSale = function(limit = 10) {
  return this.find({ 
    isOnSale: true, 
    status: 'active',
    salePrice: { $exists: true, $ne: null }
  })
  .sort({ discountPercentage: -1 })
  .limit(limit);
};

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    limit = 20
  } = options;

  let searchQuery = { status: 'active' };

  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }

  // Category filter
  if (category && category !== 'all') {
    searchQuery.category = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    searchQuery.currentPrice = {};
    if (minPrice !== undefined) searchQuery.currentPrice.$gte = minPrice;
    if (maxPrice !== undefined) searchQuery.currentPrice.$lte = maxPrice;
  }

  // Rating filter
  if (minRating) {
    searchQuery.rating = { $gte: minRating };
  }

  // Stock filter
  if (inStock) {
    searchQuery.stock = { $gt: 0 };
  }

  // Sort options
  let sortOptions = {};
  switch (sortBy) {
    case 'price':
      sortOptions.currentPrice = sortOrder === 'desc' ? -1 : 1;
      break;
    case 'rating':
      sortOptions.rating = sortOrder === 'desc' ? -1 : 1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'popular':
      sortOptions.reviews = -1;
      break;
    default:
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
  }

  const skip = (page - 1) * limit;

  return this.find(searchQuery)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema); 