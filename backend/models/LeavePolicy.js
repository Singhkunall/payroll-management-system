import mongoose from 'mongoose';

const leavePolicySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true // e.g., "Sick Leave", "Casual Leave"
  },
  days: { 
    type: Number, 
    required: true // Saal mein kitne din milenge
  },
  description: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive'], 
    default: 'Active' 
  }
}, { timestamps: true });

const LeavePolicy = mongoose.model('LeavePolicy', leavePolicySchema);
export default LeavePolicy;