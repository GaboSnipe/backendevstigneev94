import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        id: { type: String },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String },
        passwordHash: { type: String, required: true },
        avatarUrl:  { type: String},
        roles: [{ type: String, ref: 'Role' }],
        userWishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        cartitems: [{ type: Object, ref: 'Product' }]
    }, 
    {
        timestamps: true,
    },
);

export default mongoose.model('User', UserSchema);
