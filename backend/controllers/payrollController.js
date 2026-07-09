import Salary from '../models/Salary.js';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import LeaveRequest from '../models/LeaveRequest.js'; 

// --- STEP 2: Helper to calculate actual working days ---
const getWorkingDays = (month, year) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthIndex = monthNames.indexOf(month);
    
    // Month ke total days nikalna
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    let sundays = 0;
    for (let i = 1; i <= totalDays; i++) {
        const day = new Date(year, monthIndex, i).getDay();
        if (day === 0) sundays++; 
    }

    const fixedHolidays = 0; 
    const actualWorkingDays = totalDays - sundays - fixedHolidays;

    return { totalDays, actualWorkingDays, monthIndex };
};

// --- STEP 3, 4 & 5: Automatic Payroll Generator ---
export const generatePayroll = async (req, res) => {
    try {
        const { month, year, employeeId } = req.body; 
        const { actualWorkingDays, monthIndex } = getWorkingDays(month, year);
        const monthString = `${month} ${year}`;

        // 1. Check for Payroll Lock
        const lockedPayroll = await Salary.findOne({ month: monthString, status: 'Paid' });
        if (lockedPayroll && !employeeId) { 
            return res.status(400).json({ 
                success: false, 
                message: "Payroll for this month is LOCKED and marked as Paid. Cannot regenerate." 
            });
        }

        const filter = employeeId ? { _id: employeeId } : { status: 'Active' };
        const employees = await Employee.find(filter);
        
        const payrollResults = [];
        const queryDate = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;

        for (let emp of employees) {
            try {
                // =========================================================
                // 🛑 CHEAT CODE APPLIED HERE (For Testing Only)
                // =========================================================
                // Original database call is commented out:
                
                const attendanceCount = await Attendance.countDocuments({
                    employeeId: emp._id,
                    date: { $regex: `^${queryDate}` },
                    status: { $in: ['Present', 'Late'] }
                });
            
                
                // Directly setting 22 days present for everyone:
                
                // =========================================================


                // B. STEP 4: Unpaid Leaves (LWP) Calculation
                let unpaidLeaves = 0;
                try {
                    unpaidLeaves = await LeaveRequest.countDocuments({
                        employee: emp._id,
                        status: 'Approved',
                        leaveType: 'LWP',
                        startDate: { $regex: queryDate } 
                    });
                } catch (leaveErr) { console.log("Leave fetch issue for", emp.name) }

                // C. Salary Calculation Logic
                const gross = emp.salaryStructure?.grossSalary || emp.baseSalary || 0;
                const perDayWage = actualWorkingDays > 0 ? gross / actualWorkingDays : 0;
                
                // Net earned based on attendance
                const earnedSalary = perDayWage * attendanceCount;

                // D. Breakdown & Deductions
                const basic = emp.salaryStructure?.basic || (gross * 0.5);
                const hra = emp.salaryStructure?.hra || (gross * 0.2);
                const allowances = emp.salaryStructure?.allowances || (gross * 0.3);
                const pf = (basic * ((emp.salaryStructure?.pfPercentage || 12) / 100)) || 0;
                const pt = emp.salaryStructure?.professionalTax || 200;

                // Total Deduction = (Deduction due to absent/LWP) + PF + PT
                const lossOfPay = gross - earnedSalary;
                const finalNetSalary = Math.round(earnedSalary - pf - pt);

                // E. Save or Update in Database
                const payrollRecord = await Salary.findOneAndUpdate(
                    { employee: emp._id, month: monthString },
                    {
                        basic,
                        hra,
                        allowances,
                        pf,
                        tax: pt,
                        deductions: Math.round(lossOfPay), 
                        netSalary: finalNetSalary > 0 ? finalNetSalary : 0,
                        status: 'Pending',
                        workingDays: actualWorkingDays,
                        presentDays: attendanceCount,
                        unpaidLeaves: unpaidLeaves 
                    },
                    { upsert: true, new: true }
                );

                payrollResults.push(payrollRecord);
            } catch (innerErr) {
                console.error(`Skipping ${emp.name} due to invalid data format.`);
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Payroll for ${monthString} generated successfully!`, 
            data: payrollResults 
        });

    } catch (error) {
        console.error("Main Payroll Error:", error);
        res.status(500).json({ success: false, message: "Payroll Generation Error: " + error.message });
    }
};

// --- GET ALL SALARIES ---
export const getAllSalaries = async (req, res) => {
    try {
        const { month } = req.query; 
        let query = {};
        if (month) query.month = month;

        const salaries = await Salary.find(query).populate('employee', 'name employeeId department');
        res.status(200).json({ success: true, salaries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getEmployeeSalaries = async (req, res) => {
    try {
        // req.user auth token se aayega
        const employeeId = req.user.id || req.user._id; 
        
        // Sirf is employee ka data dhundo aur latest ko upar rakho
        const salaries = await Salary.find({ employee: employeeId })
                                     .populate('employee', 'name employeeId department')
                                     .sort({ createdAt: -1 });
                                     
        res.status(200).json({ success: true, salaries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const calculatePayroll = (req, res) => generatePayroll(req, res);