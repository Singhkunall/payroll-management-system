import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    punchIn: {
        type: String, // HH:MM AM/PM
    },
    punchOut: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Leave', 'Holiday'],
        default: 'Present'
    },
    markedBy: {
        type: String,
        enum: ['Self', 'Admin'],
        default: 'Self' // Step 2 ke liye zaroori hai
    },
    remark: {
        type: String, // Agar Admin change kare toh reason likh sake (Step 3)
    }
}, { timestamps: true });

// Ek employee, ek din, ek record
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;