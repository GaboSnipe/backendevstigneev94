import mongoose from 'mongoose';

const blackListSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  reason: { type: String, },
});

const BlacklistModel = mongoose.model('Blacklist', blackListSchema);

export default BlacklistModel;
