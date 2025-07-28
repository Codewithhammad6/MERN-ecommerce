const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadMultipleMiddleware } = require('../middleware/upload');

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5'),
  query('inStock').optional().isBoolean().withMessage('In stock must be a boolean'),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'newest', 'popular']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('search').optional().isString().withMessage('Search must be a string')
], optionalAuth, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sortBy = 'name',
      sortOrder = 'asc',
      search
    } = req.query;

    const options = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      inStock: inStock === 'true',
      sortBy,
      sortOrder,
      page: parseInt(page),
      limit: parseInt(limit)
    };

    const products = await Product.search(search, options);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments({ status: 'active' });

    res.json({
      success: true,
      count: products.length,
      totalProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalProducts / limit)
      },
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await Product.getFeatured(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get products on sale
// @route   GET /api/products/sale
// @access  Public
router.get('/sale', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await Product.getOnSale(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get sale products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), uploadMultipleMiddleware, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn([
      'Electronics', 'Fashion & Apparel', 'Home & Garden', 'Sports & Outdoors',
      'Beauty & Personal Care', 'Books & Media', 'Toys & Games', 'Automotive',
      'Health & Wellness', 'Food & Beverages', 'Jewelry & Accessories',
      'Pet Supplies', 'Office & Business', 'Baby & Kids', 'Art & Crafts',
      'Music & Instruments', 'Tools & Hardware', 'Travel & Luggage',
      'Phones & Accessories', 'Computers & Laptops'
    ])
    .withMessage('Invalid category'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('brand')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Brand must be less than 50 characters'),
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('SKU must be less than 20 characters'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  body('salePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Sale price must be a positive number'),
  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be between 0 and 100'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('isOnSale')
    .optional()
    .isBoolean()
    .withMessage('isOnSale must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one product image'
      });
    }

    // Process uploaded images
    const images = req.files.map(file => {
      // In a real application, you would upload to cloud storage
      // For now, we'll use the file path
      return `/uploads/${file.filename}`;
    });

    const productData = {
      ...req.body,
      images,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : undefined,
      discountPercentage: req.body.discountPercentage ? parseFloat(req.body.discountPercentage) : undefined,
      weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
      isFeatured: req.body.isFeatured === 'true',
      isOnSale: req.body.isOnSale === 'true',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), uploadMultipleMiddleware, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isIn([
      'Electronics', 'Fashion & Apparel', 'Home & Garden', 'Sports & Outdoors',
      'Beauty & Personal Care', 'Books & Media', 'Toys & Games', 'Automotive',
      'Health & Wellness', 'Food & Beverages', 'Jewelry & Accessories',
      'Pet Supplies', 'Office & Business', 'Baby & Kids', 'Art & Crafts',
      'Music & Instruments', 'Tools & Hardware', 'Travel & Luggage',
      'Phones & Accessories', 'Computers & Laptops'
    ])
    .withMessage('Invalid category'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Process uploaded images if any
    let images = product.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages].slice(0, 4); // Keep only 4 images
    }

    const updateData = {
      ...req.body,
      images,
      price: req.body.price ? parseFloat(req.body.price) : product.price,
      stock: req.body.stock ? parseInt(req.body.stock) : product.stock,
      salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : product.salePrice,
      discountPercentage: req.body.discountPercentage ? parseFloat(req.body.discountPercentage) : product.discountPercentage,
      weight: req.body.weight ? parseFloat(req.body.weight) : product.weight,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured === 'true' : product.isFeatured,
      isOnSale: req.body.isOnSale !== undefined ? req.body.isOnSale === 'true' : product.isOnSale,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : product.tags
    };

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
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
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private (Admin only)
router.patch('/:id/stock', protect, authorize('admin'), [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('action')
    .isIn(['add', 'subtract'])
    .withMessage('Action must be either add or subtract')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { quantity, action } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (action === 'add') {
      await product.addStock(quantity);
    } else {
      await product.updateStock(quantity);
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 