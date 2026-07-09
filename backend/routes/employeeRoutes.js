import express from 'express';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js'; 

const router = express.Router();

// --- 1. SABSE PEHLE SPECIFIC ROUTES (Pehle pakke raste) ---

// Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments() || 0;
    const totalDepartments = await Department.countDocuments() || 0;
    
    const salaryResult = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: { $ifNull: ["$baseSalary", 0] } } } }
    ]);

    // BEHTAR AGGREGATION:
    let deptStats = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { 
        $lookup: { 
          from: "departments", // AGAR YE KAAM NA KARE TOH "department" (bin 's' ke) try karein
          localField: "_id", 
          foreignField: "_id", 
          as: "deptDetails" 
        } 
      },
      { $unwind: "$deptDetails" },
      { $project: { _id: 0, name: "$deptDetails.name", value: "$count" } }
    ]);

    // BACKUP: Agar aggregation khali aaye toh manual top stats dikhao
    if (deptStats.length === 0) {
      deptStats = [
        { name: 'Total Employees', value: totalEmployees },
        { name: 'Total Departments', value: totalDepartments }
      ];
    }

    res.json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: salaryResult.length > 0 ? salaryResult[0].totalSalary : 0,
      chartData: deptStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// All Employees (Isko wapas le aaya hoon!) - UPDATE: Added Shift Populate
router.get('/all', async (req, res) => {
  try {
    const employees = await Employee.find({})
      .populate('department', 'name')
      .populate('designation', 'name')
      .populate('shift', 'name startTime endTime'); // <-- YE ADD KIYA HAI BASS
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 2. POST/PUT ROUTES ---

router.post('/add', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const createdEmployee = await employee.save();
    res.status(201).json(createdEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 3. SABSE AAKHIR MEIN DYNAMIC PARAMETER (:id) ---

// Get Single Employee - UPDATE: Added Shift Populate
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department')
      .populate('designation')
      .populate('shift'); // <-- YE ADD KIYA HAI BASS
    
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee nahi mila" });
    }
    res.json({ success: true, employee }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Employee Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;