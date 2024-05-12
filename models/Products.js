import mongoose from "mongoose";

// const productsSchema = new mongoose.Schema({
//         name: { type: String, required: true, },
//         description: { type: String, required: true,},  
//         isInStock: { type: Number, required: true, },
//         category: { type: String, default: 0, },
//         availableSizes: { type: Array, default: [],  },
//         reviews: { type: Array,  default: [],  },
//         price: { type: Number, required: true,  },
//         brandName: { type: String, default: 0, },
//         imageUrl: String, }, 
//     {
//         timestamps: true,
//     },
// );

const productsSchema = new mongoose.Schema({
    // id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true},
    isInStock: { type: Boolean},
    // gender: { type: String },
    category: { type: String },
    availableSizes: { type: Array },
    // rating: { type: Number },
    reviews: { type: Array },
    // totalReviewCount: { type: Number },
    produtionDate: { type: String },
    price: { type: Number }, //changed
    brandName: { type: String },
    productCode: { type: Number },
    imageUrl: { type: String },
    additionalImageUrls: { type: Array },
})

export default mongoose.model('products', productsSchema);
