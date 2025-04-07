// models/orderSchema.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);
