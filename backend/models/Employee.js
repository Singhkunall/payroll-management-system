import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  designation: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Designation', 
    required: true 
  },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  },
  // salary : {type : Number, required : true},

  
  // --- STEP 1: Updated Salary Structure ---
  salaryStructure: {
    grossSalary: { type: Number, required: true }, // Total fixed salary
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    pfPercentage: { type: Number, default: 12 }, // Statutory PF
    professionalTax: { type: Number, default: 200 }, // Fixed PT
    bonus: { type: Number, default: 0 }
  },
  // ----------------------------------------

  role: { 
    type: String, 
    default: 'Employee' 
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
    required: false
  }
}, { timestamps: true });

// Password hashing logic
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;