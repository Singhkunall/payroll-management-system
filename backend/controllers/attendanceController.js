import Attendance from '../models/Attendance.js';

// --- STEP 1: PUNCH IN (With Late Logic) ---
export const clockIn = async (req, res) => {
    const { userId } = req.body; 
    const today = new Date().toISOString().split('T')[0];
    
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        const existingRecord = await Attendance.findOne({ employeeId: userId, date: today });
        
        if (existingRecord) {
            return res.status(400).json({ success: false, message: "Aap aaj pehle hi Punch-In kar chuke hain!" });
        }

        // --- LATE LOGIC ---
        let status = 'Present';
        const limitTime = new Date();
        limitTime.setHours(9, 15, 0); // Agar 9:15 AM se late hai toh 'Late' mark hoga

        if (now > limitTime) {
            status = 'Late';
        }

        const entry = new Attendance({ 
            employeeId: userId, 
            date: today, 
            punchIn: currentTime, 
            status: status,
            markedBy: 'Self' // Aapke Step 2 ke liye: Pata chalega employee ne khud lagayi hai
        });

        await entry.save();
        res.status(201).json({ success: true, message: `Punch-In successful! Status: ${status}`, entry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error: " + error.message });
    }
};

// --- PUNCH OUT ---
export const clockOut = async (req, res) => {
    const { userId } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
        const attendance = await Attendance.findOne({ employeeId: userId, date: today });

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Pehle Punch-In kijiye!" });
        }

        if (attendance.punchOut) {
            return res.status(400).json({ success: false, message: "Aap aaj pehle hi Punch-Out kar chuke hain!" });
        }

        attendance.punchOut = currentTime;
        await attendance.save();

        res.status(200).json({ success: true, message: "Punch-Out successful!", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Punch-Out Error: " + error.message });
    }
};

// --- GET HISTORY (For Employee & Admin) ---
export const getAttendanceByUser = async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.params.userId }).sort({ date: -1 });
        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching history" });
    }
};
export const getAllAttendance = async (req, res) => {
    try {
        // Hum 'employeeId' ko populate kar rahe hain taaki name aur dept mil sake
        const allRecords = await Attendance.find({})
            .populate('employeeId', 'name department employeeId') // Employee model se fields uthayega
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, records: allRecords });
    } catch (error) {
        res.status(500).json({ success: false, message: "Admin Fetch Error: " + error.message });
    }
};
// --- STEP 3: ADMIN MANUAL MARK/EDIT ---
export const adminUpdateAttendance = async (req, res) => {
    const { employeeId, date, status, punchIn, remark } = req.body;

    try {
        // Check karein ki kya us din ka record pehle se hai
        let record = await Attendance.findOne({ employeeId, date });

        if (record) {
            // Edit existing record
            record.status = status;
            if (punchIn) record.punchIn = punchIn;
            record.markedBy = 'Admin'; // Transparency ke liye
            record.remark = remark || "Updated by Admin";
            await record.save();
        } else {
            // Create new record manually
            record = new Attendance({
                employeeId,
                date,
                status,
                punchIn: punchIn || "09:00 AM",
                markedBy: 'Admin',
                remark: remark || "Manually marked by Admin"
            });
            await record.save();
        }

        res.status(200).json({ success: true, message: "Attendance updated by Admin!", record });
    } catch (error) {
        res.status(500).json({ success: false, message: "Admin Update Error: " + error.message });
    }
};