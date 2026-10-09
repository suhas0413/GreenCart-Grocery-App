import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 99 },
  image: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator(items) {
        return items.length > 0 && items.length <= 50;
      },
      message: 'An order must contain between 1 and 50 items.',
    },
  },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);