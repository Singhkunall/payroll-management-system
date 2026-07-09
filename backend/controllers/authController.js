import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Token generate karne ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- 1. ADMIN SIGNUP ---
export const signupAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: "Admin already exists" });

        // User model mein bhi pre-save hook hona chahiye hashing ke liye
        const user = await User.create({ name, email, password, role: 'Admin' });
        
        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Signup Error: " + error.message });
    }
};

// --- 2. LOGIN (ADMIN + EMPLOYEE) ---
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Check in Admin table
        let user = await User.findOne({ email });
        if (!user) {
            // 2. Check in Employee table
            user = await Employee.findOne({ email });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // 3. Compare Password using the model method
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, 
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Login Error: " + error.message });
    }
};

// --- 3. FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) user = await Employee.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset - PayLynx',
            html: `<h3>Password Reset Request</h3>
                   <p>Click the link below to reset your password. Valid for 30 minutes.</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ success: true, message: "Reset link sent to your email!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 4. RESET PASSWORD ---
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        let user = await User.findById(decoded.id);
        if (!user) user = await Employee.findById(decoded.id);
        
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update password (model's pre-save hook will hash this)
        user.password = password; 
        await user.save();

        res.json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
};

// --- 5. ADD EMPLOYEE ---
export const addEmployee = async (req, res) => {
    try {
        const { name, email, password, department, designation, baseSalary, phone, shift } = req.body;
        
        const empExists = await Employee.findOne({ email });
        const adminExists = await User.findOne({ email });
        
        if (empExists || adminExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // --- BASS YE NAYA LOGIC ADD KIYA HAI ---
        const gross = Number(baseSalary) || 0;
        const salaryStructure = {
            grossSalary: gross,
            basic: gross * 0.5,
            hra: gross * 0.2,
            allowances: gross * 0.3,
            pfPercentage: 12,
            professionalTax: 200,
            bonus: 0
        };

        const employee = new Employee({
            name,
            email,
            password, 
            department,
            designation,
            baseSalary, // Purana wala bhi bhej rahe hain taaki agar frontend expect kare toh crash na ho
            salaryStructure, // Naya structure yahan save ho jayega!
            phone,
            shift,
            role: 'Employee'
        });

        await employee.save();
        res.status(201).json({ success: true, message: "Employee added successfully" });
    } catch (error) {
        console.error("Add Employee Error:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};