import Department from '../models/Department.js';

// 1. Naya Department banane ke liye
export const addDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Check agar pehle se hai
        const exists = await Department.findOne({ name });
        if (exists) return res.status(400).json({ success: false, message: "Department already exists" });

        const newDept = new Department({ name, description });
        await newDept.save();
        
        res.status(201).json({ success: true, message: "Department Added!", department: newDept });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Saare Departments fetch karne ke liye
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, departments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete karne ke liye
export const deleteDepartment = async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Department Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};