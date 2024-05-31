import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  reviewTitle: { type: String, required: true },
  reviewText: { type: String, required: true },
  date: { type: Date, required: true }
});

export default mongoose.model('Review', reviewSchema);