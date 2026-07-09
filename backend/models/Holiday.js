import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['National', 'Optional', 'Company', 'Weekend Override'], 
    default: 'National' 
  },
  isPaid: { type: Boolean, default: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Holiday', holidaySchema);