import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Purane galat admin ko delete kar dete hain
    console.log('Removing old admin account...');
    await User.deleteMany({ email: 'admin@paylynx.com' });

    // Ab naya Fresh Admin banate hain
    const admin = new User({
      name: 'Kunal Kumar',
      email: 'admin@paylynx.com',
      password: 'adminpassword123', // Ise dhyan se dekh lein
      role: 'Admin',
      department: 'IT',
      designation: 'System Administrator'
    });

    await admin.save();
    console.log('✅ Fresh Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();