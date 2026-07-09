import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js'; 
import departmentRoutes from './routes/departmentRoutes.js'; 
import designationRoutes from './routes/designationRoutes.js'; 
import holidayRoutes from './routes/holidayRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';

// --- Naya Route Import (Yahan add kiya) ---
import leaveRoutes from './routes/leaveRoutes.js'; 

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Database connection
connectDB();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://payroll-management-system-virid.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// API Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/employees', employeeRoutes); 
app.use('/api/holidays', holidayRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/shifts', shiftRoutes);

// --- Leave Route Register (Yahan add kiya) ---
app.use('/api/leaves', leaveRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Payroll Management System API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Port setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));