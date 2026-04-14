const mongoose = require('mongoose');

/**
 * Transaction Schema
 * Tracks financial movement, commission calculation, and seller payouts.
 */
const TransactionSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['SALE', 'PAYOUT', 'REFUND'],
    required: true,
  },
  gross_amount: {
    type: Number,
    required: true,
  },
  commission_amount: {
    type: Number,
    required: true,
  },
  net_amount: {
    type: Number, // Amount to be paid to the seller
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
  payout_id: String, // Reference to the payment gateway payout ID
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
