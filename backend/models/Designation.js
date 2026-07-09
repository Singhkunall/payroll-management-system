import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model('Designation', designationSchema);