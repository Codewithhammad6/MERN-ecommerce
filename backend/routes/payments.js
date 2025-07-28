const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', [
  body('amount')
    .isFloat({ min: 0.5 })
    .withMessage('Amount must be at least 0.50'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
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

    const { amount, orderId, currency = 'usd' } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to pay for this order'
      });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'Order is already paid'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required')
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

    const { paymentIntentId, orderId } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to pay for this order'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Process payment success
      const paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };

      await order.processPayment(paymentResult);

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        data: order
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed'
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', [
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Refund amount must be positive'),
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

    const { orderId, amount, reason } = req.body;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if order is paid
    if (!order.isPaid) {
      return res.status(400).json({
        success: false,
        error: 'Order is not paid'
      });
    }

    // Check if refund amount is valid
    if (amount > order.totalPrice) {
      return res.status(400).json({
        success: false,
        error: 'Refund amount cannot exceed order total'
      });
    }

    // Process refund through Stripe if payment was made via Stripe
    if (order.paymentResult && order.paymentResult.id) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: order.paymentResult.id,
          amount: Math.round(amount * 100), // Convert to cents
          reason: 'requested_by_customer'
        });

        // Update order with refund information
        await order.processRefund(amount, reason);

        res.json({
          success: true,
          message: 'Refund processed successfully',
          data: {
            order,
            refund: {
              id: refund.id,
              amount: refund.amount / 100,
              status: refund.status
            }
          }
        });
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError);
        res.status(400).json({
          success: false,
          error: 'Failed to process refund through payment processor'
        });
      }
    } else {
      // Manual refund for non-Stripe payments
      await order.processRefund(amount, reason);

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: order
      });
    }
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', async (req, res) => {
  try {
    // In a real application, you might store payment methods for users
    // For now, we'll return available payment methods
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, American Express, or Discover',
        icon: '💳'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🔵'
      }
    ];

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Webhook for Stripe events
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      
      // Update order status if needed
      if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
        try {
          const order = await Order.findById(paymentIntent.metadata.orderId);
          if (order && !order.isPaid) {
            const paymentResult = {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email
            };
            await order.processPayment(paymentResult);
          }
        } catch (error) {
          console.error('Error updating order from webhook:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    case 'charge.refunded':
      const refund = event.data.object;
      console.log('Refund processed:', refund.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 