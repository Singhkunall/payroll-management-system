import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  month: { type: String, required: true }, // e.g., "July"
  year: { type: Number, required: true },
  basicSalary: { type: Number, required: true },
  allowances: {
    houseRent: { type: Number, default: 0 },
    medical: { type: Number, default: 0 }
  },
  deductions: {
    providentFund: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  netPay: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;