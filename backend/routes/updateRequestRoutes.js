import express from 'express';
import UpdateRequest from '../models/UpdateRequest.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// 1. Employee: Naya update request banaye
router.post('/create', async (req, res) => {
  try {
    const { employeeId, fieldName, oldValue, newValue } = req.body;

    const request = new UpdateRequest({
      employee: employeeId,
      fieldName,
      oldValue,
      newValue
    });

    await request.save();
    res.status(201).json({ success: true, message: "Request submitted for admin approval", request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Employee: Apni saari requests dekhe (status ke sath)
router.get('/my/:employeeId', async (req, res) => {
  try {
    const requests = await UpdateRequest.find({ employee: req.params.employeeId }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Admin: Saari pending requests dekhe (employee ka naam bhi saath mein)
router.get('/all', async (req, res) => {
  try {
    const requests = await UpdateRequest.find({})
      .populate('employee', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Admin: Request Approve kare (aur actual Employee data update ho)
router.put('/:id/approve', async (req, res) => {
  try {
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const employee = await Employee.findById(request.employee);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

    // Field name ke hisaab se sahi jagah update karo
    if (request.fieldName === 'phone') {
      employee.phone = request.newValue;
    } else if (request.fieldName === 'panNumber') {
      employee.panNumber = request.newValue;
    } else if (request.fieldName === 'bankAccountNumber') {
      employee.bankDetails.accountNumber = request.newValue;
    } else if (request.fieldName === 'bankIfscCode') {
      employee.bankDetails.ifscCode = request.newValue;
    } else if (request.fieldName === 'bankName') {
      employee.bankDetails.bankName = request.newValue;
    }

    await employee.save();

    request.status = 'Approved';
    await request.save();

    res.json({ success: true, message: "Request approved and employee updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Admin: Request Reject kare
router.put('/:id/reject', async (req, res) => {
  try {
    const { adminNote } = req.body;
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    request.status = 'Rejected';
    request.adminNote = adminNote || '';
    await request.save();

    res.json({ success: true, message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;