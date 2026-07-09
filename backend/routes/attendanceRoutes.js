import express from 'express';
// Saare functions ko ek hi baar clean tarike se import kiya
import { 
  clockIn, 
  clockOut, 
  getAttendanceByUser, 
  getAllAttendance,
  adminUpdateAttendance 
} from '../controllers/attendanceController.js';

const router = express.Router();

// 1. Employee Punch-In/Out (Step 1)
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);

// 2. Employee apni history dekh sakega (Step 1)
router.get('/:userId', getAttendanceByUser);

// 3. ADMIN MONITOR - Saare records dekhne ke liye (Step 2)
router.get('/admin/all', getAllAttendance);

// 4. ADMIN UPDATE - Manual edit/mark karne ke liye (Step 3)
router.post('/admin/update', adminUpdateAttendance);

export default router;