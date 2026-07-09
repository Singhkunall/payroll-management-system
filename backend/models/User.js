import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Role-Based Access Control (RBAC)
  role: { 
    type: String, 
    enum: ['Admin', 'Employee'], 
    default: 'Employee' 
  },
  
  // Professional Details
  department: { type: String },
  designation: { type: String },
  joiningDate: { type: Date, default: Date.now },
  
  // Profile Picture
  profileImage: { type: String }, 

  // Financial & Identity Details
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String }
  },
  panNumber: { type: String },
  contactNumber: { type: String }

}, { timestamps: true });

// Password match karne ke liye method (Model se PEHLE define karna hai)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Model sabse aakhri mein banta hai
const User = mongoose.model('User', userSchema);
export default User;