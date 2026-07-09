import express from 'express';
import { 
  calculatePayroll, 
  getAllSalaries, 
  generatePayroll,
  getEmployeeSalaries // <-- Naya import add kiya Step 7 ke liye
} from '../controllers/payrollController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Saari salaries fetch karne ke liye (Admin Only)
router.get('/all', protect, adminOnly, getAllSalaries);

// 2. Payroll process karne ke liye (Admin Only)
router.post('/generate', protect, adminOnly, generatePayroll);

// 3. Purana calculation route
router.post('/calculate', protect, adminOnly, calculatePayroll);

// 4. --- NAYA ROUTE (STEP 7: EMPLOYEE DASHBOARD) ---
// Dhyan de: Isme 'adminOnly' nahi hai taaki employee isko access kar sake
router.get('/my-salaries', protect, getEmployeeSalaries);

export default router;