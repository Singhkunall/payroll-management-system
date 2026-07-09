import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "18:00"
  lateGraceTime: { type: Number, default: 15 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Shift = mongoose.model('Shift', shiftSchema);
export default Shift;