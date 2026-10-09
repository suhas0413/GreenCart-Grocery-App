import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 60 },
  price: { type: Number, required: true, min: 0 },
  offerPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator(value) {
        return value <= this.price;
      },
      message: 'Offer price cannot exceed the regular price.',
    },
  },
  image: { type: [String], default: [] },
  description: { type: [String], default: [] },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);