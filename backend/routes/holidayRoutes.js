import express from 'express';
import Holiday from '../models/Holiday.js';

const router = express.Router();

// 1. Naya Holiday add karna (Admin side)
router.post('/add', async (req, res) => {
  try {
    const newHoliday = new Holiday(req.body);
    await newHoliday.save();
    res.status(201).json({ success: true, message: "Holiday added successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. Saare Holidays ki list dekhna
router.get('/all', async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Holiday Delete karna (Admin side) - YE ADD KARO
router.delete('/:id', async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) {
      return res.status(404).json({ success: false, message: "Holiday not found" });
    }
    res.json({ success: true, message: "Holiday deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// 4. Aaj ki chutti check karna (For Attendance Blocking)
router.get('/check-today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sirf date check karni hai, time nahi

    const holiday = await Holiday.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (holiday) {
      return res.json({ isHoliday: true, holiday });
    }
    res.json({ isHoliday: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Admin Report: Yearly Summary
router.get('/admin-report/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const holidays = await Holiday.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // Summary calculation
    const summary = {
      total: holidays.length,
      national: holidays.filter(h => h.type === 'National').length,
      optional: holidays.filter(h => h.type === 'Optional').length,
      company: holidays.filter(h => h.type === 'Company').length,
      paid: holidays.filter(h => h.isPaid).length
    };

    res.json({ success: true, summary, holidays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;