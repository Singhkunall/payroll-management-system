import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js'; // <-- Isey import karna zaroori tha!

// Verify if the user is logged in
export const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 1. Pehle Admin (User) table mein check karo
            let currentUser = await User.findById(decoded.id).select('-password');
            
            // 2. Agar Admin nahi mila, toh Employee table mein check karo
            if (!currentUser) {
                currentUser = await Employee.findById(decoded.id).select('-password');
            }

            // 3. Agar dono mein nahi mila toh error fek do
            if (!currentUser) {
                return res.status(401).json({ success: false, message: "User not found with this token" });
            }

            // 4. User mil gaya, ab aage badho
            req.user = currentUser;
            next();
            
        } catch (error) {
            console.error("Token Auth Error:", error);
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }
};

// Verify if the user is an Admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
};