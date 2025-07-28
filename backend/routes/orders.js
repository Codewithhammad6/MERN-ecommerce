const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('orderItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress')
    .isObject()
    .withMessage('Shipping address is required'),
  body('shippingAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty()
    .withMessage('Zip code is required'),
  body('paymentMethod')
    .isIn(['Credit Card', 'PayPal', 'Stripe', 'Cash on Delivery'])
    .withMessage('Invalid payment method')
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

    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    // Validate products and check stock
    const validatedOrderItems = [];
    let totalItemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product with ID ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      // Use sale price if available, otherwise regular price
      const price = product.salePrice || product.price;
      const itemTotal = price * item.quantity;
      totalItemsPrice += itemTotal;

      validatedOrderItems.push({
        product: product._id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        image: product.images[0] || '',
        sku: product.sku || ''
      });

      // Update product stock
      await product.updateStock(item.quantity);
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      notes,
      itemsPrice: totalItemsPrice
    });

    // Calculate totals
    order.calculateTotals();
    await order.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get('/my-orders', protect, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
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

    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.getUserOrders(req.user.id, parseInt(page), parseInt(limit));
    const totalOrders = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: orders.length,
      totalOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalOrders / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), [
  body('status')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'])
    .withMessage('Invalid order status'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string'),
  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string'),
  body('shippingCarrier')
    .optional()
    .isIn(['USPS', 'FedEx', 'UPS', 'DHL', 'Other'])
    .withMessage('Invalid shipping carrier')
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

    const { status, notes, trackingNumber, shippingCarrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update order status
    await order.updateStatus(status, notes);

    // Update tracking information if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    if (shippingCarrier) {
      order.shippingCarrier = shippingCarrier;
    }

    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, [
  body('reason')
    .optional()
    .isString()
    .withMessage('Cancel reason must be a string')
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

    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled'
      });
    }

    // Cancel order
    await order.cancelOrder(reason);

    // Restore product stock if order is cancelled
    if (order.status === 'Cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          await product.addStock(item.quantity);
        }
      }
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Process refund
// @route   PUT /api/orders/:id/refund
// @access  Private (Admin only)
router.put('/:id/refund', protect, authorize('admin'), [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be a positive number'),
  body('reason')
    .notEmpty()
    .withMessage('Refund reason is required')
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

    const { amount, reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if refund amount is valid
    if (amount > order.totalPrice) {
      return res.status(400).json({
        success: false,
        error: 'Refund amount cannot exceed order total'
      });
    }

    // Process refund
    await order.processRefund(amount, reason);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get order by tracking number
// @route   GET /api/orders/track/:trackingNumber
// @access  Public
router.get('/track/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const order = await Order.findOne({ trackingNumber })
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Order.getOrderStats();

    res.json({
      success: true,
      data: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get revenue by date range (Admin only)
// @route   GET /api/orders/revenue
// @access  Private (Admin only)
router.get('/revenue', protect, authorize('admin'), [
  query('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date')
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

    const { startDate, endDate } = req.query;

    const revenue = await Order.getRevenueByDateRange(startDate, endDate);

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router; 