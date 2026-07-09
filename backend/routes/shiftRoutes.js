import express from 'express';
import Shift from '../models/Shift.js';
import Employee from '../models/Employee.js'; // Employee check karne ke liye add kiya

const router = express.Router();

// --- 1. GET ALL SHIFTS ---
router.get('/all', async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 2. ADD NEW SHIFT ---
router.post('/add', async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    await newShift.save();
    res.status(201).json({ success: true, message: "Shift created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 3. UPDATE SHIFT (NEW) ---
router.put('/:id', async (req, res) => {
  try {
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Isse updated data wapas milta hai
    );
    if (!updatedShift) return res.status(404).json({ success: false, message: "Shift nahi mili" });
    
    res.json({ success: true, message: "Shift updated successfully!", updatedShift });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 4. DELETE SHIFT (NEW) ---
router.delete('/:id', async (req, res) => {
  try {
    // Check karo ki koi employee is shift mein hai toh nahi?
    const employeeInShift = await Employee.findOne({ shift: req.params.id });
    if (employeeInShift) {
      return res.status(400).json({ 
        success: false, 
        message: "Ye shift delete nahi ho sakti kyunki employees isme assigned hain!" 
      });
    }

    const deletedShift = await Shift.findByIdAndDelete(req.params.id);
    if (!deletedShift) return res.status(404).json({ success: false, message: "Shift pehle hi delete ho chuki hai" });

    res.json({ success: true, message: "Shift deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;