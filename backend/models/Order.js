const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String
  },
  sku: {
    type: String
  }
});

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'United States'
  }
});

const paymentResultSchema = new mongoose.Schema({
  id: {
    type: String
  },
  status: {
    type: String
  },
  update_time: {
    type: String
  },
  email_address: {
    type: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'PayPal', 'Stripe', 'Cash on Delivery']
  },
  paymentResult: paymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  trackingNumber: {
    type: String
  },
  shippingCarrier: {
    type: String,
    enum: ['USPS', 'FedEx', 'UPS', 'DHL', 'Other']
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot be more than 200 characters']
  },
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  },
  refundReason: {
    type: String,
    maxlength: [200, 'Refund reason cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });
orderSchema.index({ trackingNumber: 1 });

// Virtual for order number (formatted ID)
orderSchema.virtual('orderNumber').get(function() {
  return `#${this._id.toString().slice(-8).toUpperCase()}`;
});

// Virtual for order status color
orderSchema.virtual('statusColor').get(function() {
  const statusColors = {
    'Pending': 'yellow',
    'Processing': 'blue',
    'Shipped': 'purple',
    'Delivered': 'green',
    'Cancelled': 'red',
    'Refunded': 'gray'
  };
  return statusColors[this.status] || 'gray';
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.itemsPrice = this.orderItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate tax (example: 8.5% tax rate)
  this.taxPrice = Math.round((this.itemsPrice * 0.085) * 100) / 100;

  // Calculate shipping (free shipping over $50)
  const freeShippingThreshold = parseFloat(process.env.SHIPPING_FREE_THRESHOLD) || 50;
  const shippingCost = parseFloat(process.env.SHIPPING_COST) || 5.99;
  
  this.shippingPrice = this.itemsPrice >= freeShippingThreshold ? 0 : shippingCost;

  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;

  return this;
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  
  if (newStatus === 'Delivered') {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }
  
  if (notes) {
    this.notes = notes;
  }
  
  return this.save();
};

// Method to process payment
orderSchema.methods.processPayment = function(paymentResult) {
  this.isPaid = true;
  this.paidAt = new Date();
  this.paymentResult = paymentResult;
  this.status = 'Processing';
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason) {
  this.status = 'Cancelled';
  this.cancelReason = reason;
  
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason) {
  this.status = 'Refunded';
  this.refundAmount = amount;
  this.refundReason = reason;
  
  return this.save();
};

// Static method to get orders by user
orderSchema.statics.getUserOrders = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('orderItems.product', 'name images');
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
        },
        processingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Shipped'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
        }
      }
    }
  ]);
};

// Static method to get revenue by date range
orderSchema.statics.getRevenueByDateRange = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        isPaid: true
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems')) {
    this.calculateTotals();
  }
  next();
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema); 