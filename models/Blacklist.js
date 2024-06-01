import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Blacklist', blacklistSchema);
