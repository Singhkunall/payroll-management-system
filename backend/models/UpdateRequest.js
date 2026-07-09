import mongoose from 'mongoose';

const updateRequestSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  fieldName: {
    type: String,
    required: true,
    enum: ['phone', 'panNumber', 'bankAccountNumber', 'bankIfscCode', 'bankName']
  },
  oldValue: { type: String },
  newValue: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminNote: { type: String }
}, { timestamps: true });

const UpdateRequest = mongoose.model('UpdateRequest', updateRequestSchema);
export default UpdateRequest;