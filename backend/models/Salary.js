import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true },
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }, // Attendance deduction (Loss of Pay)
    
    // 👇 YE WALA FIELD MISSING THA 👇
    netSalary: { type: Number, default: 0 }, 
    
    status: { type: String, default: 'Pending' },
    workingDays: { type: Number, default: 0 },
    presentDays: { type: Number, default: 0 },
    unpaidLeaves: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Salary', salarySchema);