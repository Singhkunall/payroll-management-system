import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { 
    login, 
    addEmployee, 
    signupAdmin, 
    forgotPassword, 
    resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

// 1. Login ke liye
router.post('/login', login);

// 2. Pehla Admin banane ke liye
router.post('/signup-admin', signupAdmin);

// 3. Admin dwara Employee register karne ke liye
router.post('/signup', protect, adminOnly, addEmployee);

// 4. Password bhool jaane par link bhejne ke liye
router.post('/forgot-password', forgotPassword);

// 5. Naya password set karne ke liye
router.post('/reset-password', resetPassword);



export default router;