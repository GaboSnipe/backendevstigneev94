import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
        fullName: {type: String, unique: true, default:"USER" },
    }, 
);

export default mongoose.model('Role', RoleSchema);
