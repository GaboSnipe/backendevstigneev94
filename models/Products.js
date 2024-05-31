import mongoose from "mongoose";
const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true},
    isInStock: { type: Boolean},
    category: { type: String },
    availableSizes: { type: Array },
    reviews: { type: Array },
    productionDate: { type: String },
    price: { type: Number },
    brandName: { type: String },
    productCode: { type: Number },
    imageUrl: { type: String },
    additionalImageUrls: { type: Array },
})

export default mongoose.model('products', productsSchema);
