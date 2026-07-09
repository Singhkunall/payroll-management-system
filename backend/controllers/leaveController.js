import LeavePolicy from '../models/LeavePolicy.js';
import LeaveRequest from '../models/LeaveRequest.js'; // Naya model import kiya

// --- POLICY FUNCTIONS ---

// Get all policies
export const getPolicies = async (req, res) => {
  try {
    const policies = await LeavePolicy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new policy
export const addPolicy = async (req, res) => {
  try {
    const { name, days, description } = req.body;
    const policy = new LeavePolicy({ name, days, description });
    await policy.save();
    res.status(201).json({ success: true, message: "Policy created!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete policy
export const deletePolicy = async (req, res) => {
    try {
      await LeavePolicy.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "Policy deleted!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// --- LEAVE REQUEST FUNCTIONS (NEW) ---

// 1. Apply for Leave (For Employee)
export const applyLeave = async (req, res) => {
  try {
    const { employee, leaveType, startDate, endDate, reason } = req.body;
    const newRequest = new LeaveRequest({
      employee,
      leaveType,
      startDate,
      endDate,
      reason
    });
    await newRequest.save();
    res.status(201).json({ success: true, message: "Leave applied successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Leave Requests (For Admin)
export const getAllLeaves = async (req, res) => {
  try {
    // Populate isliye taki employee ka naam aur email bhi dikhe
    const leaves = await LeaveRequest.find()
      .populate('employee', 'name email')
      .sort({ appliedAt: -1 }); // Nayi requests pehle dikhengi
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Update Leave Status (Approve/Reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' ya 'Rejected'
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!leave) return res.status(404).json({ success: false, message: "Request nahi mili" });

    res.json({ success: true, message: `Leave ${status} successfully!`, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};