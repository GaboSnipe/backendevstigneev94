import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderStatus: { type: String},
    cartItems: { type: Array},
    formData: { type: Object },
    selectedItem: { type: String },
})

export default mongoose.model('orders', ordersSchema);
