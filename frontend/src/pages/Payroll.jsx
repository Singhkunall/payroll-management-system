import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { 
  Calculator, Download, FileSpreadsheet, FileText, 
  CheckCircle, Loader2, Search, Filter 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Libraries for Export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <-- IMPORT FIX
import * as XLSX from 'xlsx';

const Payroll = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [month, setMonth] = useState('February');
  const [year, setYear] = useState('2026');

  // Month change hote hi data fetch karne ke liye function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthString = `${month} ${year}`;
      
      const [resSal, resEmp] = await Promise.all([
        API.get(`/payroll/all?month=${monthString}`),
        API.get('/employees/all') 
      ]);
      
      const fetchedSalaries = resSal.data.salaries || resSal.data.data || resSal.data;
      setSalaries(Array.isArray(fetchedSalaries) ? fetchedSalaries : []);

      const fetchedEmployees = resEmp.data.employees || resEmp.data.data || resEmp.data;
      setEmployees(Array.isArray(fetchedEmployees) ? fetchedEmployees : []);

    } catch (err) {
      console.error("Fetch Data Error:", err);
      toast.error("Data fetch karne mein dikkat aayi!");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // Payroll Generate Logic
  const handleGenerate = async (empId = null) => {
    setGenLoading(true);
    try {
      const res = await API.post('/payroll/generate', { month, year, employeeId: empId });
      if(res.data.success) {
        toast.success(empId ? "Employee payroll processed!" : `${month} ${year} payroll generated!`);
        fetchData(); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed!");
    } finally {
      setGenLoading(false);
    }
  };

  // Status Update Logic
  const handleMarkAsPaid = async (salaryId) => {
    try {
      await API.put(`/payroll/update-status/${salaryId}`, { status: 'Paid' });
      toast.success("Salary marked as PAID");
      fetchData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salaries.map(s => ({
      Employee: s.employee?.name || 'Unknown',
      Month: s.month || 'N/A',
      'Gross Earnings': ((s.basic || 0) + (s.hra || 0) + (s.allowances || 0)).toFixed(2),
      'PF Deduction': (s.pf || 0).toFixed(2),
      'Tax/PT': (s.tax || 0).toFixed(2),
      'Attendance Deduction': (s.deductions || 0).toFixed(2),
      'Net Salary': (s.netSalary || 0).toFixed(2),
      Status: s.status || 'Pending'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
    XLSX.writeFile(workbook, `Payroll_${month}_${year}.xlsx`);
  };

  // --- PDF DOWNLOAD FIX ---
  const downloadPayslip = (s) => {
    try {
      const doc = new jsPDF();
      
      // Safety Checks for Missing Data
      const empName = s.employee?.name || 'Employee';
      const empId = s.employee?.employeeId || 'N/A';
      const basic = s.basic || 0;
      const hra = s.hra || 0;
      const allowances = s.allowances || 0;
      const pf = s.pf || 0;
      const tax = s.tax || 0;
      const deductions = s.deductions || 0;
      const netSalary = s.netSalary || 0;

      // Professional Header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(24);
      doc.setTextColor(45, 212, 191);
      doc.text("PAYLYNX HRMS", 105, 25, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Official Salary Slip for ${s.month || `${month} ${year}`}`, 105, 50, { align: "center" });

      autoTable(doc, {
        startY: 60,
        head: [['Employee Detail', 'Information']],
        body: [
          ['Name', empName],
          ['Employee ID', empId],
          ['Working Days', s.workingDays?.toString() || 'N/A'],
          ['Days Present', s.presentDays?.toString() || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [20, 184, 166] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Earnings', 'Amount (INR)', 'Deductions', 'Amount (INR)']],
        body: [
          ['Basic Pay', basic.toFixed(2), 'Provident Fund (PF)', pf.toFixed(2)],
          ['HRA', hra.toFixed(2), 'Professional Tax (PT)', tax.toFixed(2)],
          ['Allowances', allowances.toFixed(2), 'Attendance Deduction', deductions.toFixed(2)],
          ['', '', '', '']
        ],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] }
      });

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text(`Net Payable: Rs. ${netSalary.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
      
      doc.save(`Payslip_${empName}_${month}.pdf`);
      toast.success("Payslip Downloaded!");
    } catch (err) {
      console.error("PDF Error:", err);
      toast.error("Error generating PDF!");
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Payroll <span className="text-teal-400">Management</span>
          </h2>
          <p className="text-gray-500 font-medium">Step 5: Automatic Monthly Payroll Engine</p>
        </div>

        <div className="flex gap-3">
          <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all font-bold uppercase text-[10px]">
            <FileSpreadsheet size={16} /> Excel Report
          </button>
          
          <button 
            onClick={() => handleGenerate()}
            disabled={genLoading}
            className="flex items-center gap-2 bg-teal-500 text-slate-950 px-6 py-2 rounded-xl hover:bg-teal-400 transition-all font-black uppercase text-xs shadow-lg shadow-teal-500/20"
          >
            {genLoading ? <Loader2 className="animate-spin" size={16} /> : <Calculator size={16} />}
            Generate {month} Payroll
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-[#111827] p-4 rounded-2xl border border-gray-800">
         <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-1">Select Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="bg-slate-900 border border-gray-800 rounded-lg p-3 outline-none text-sm text-teal-400 font-bold">
               {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
         </div>
         <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-black text-gray-500 ml-1">Select Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="bg-slate-900 border border-gray-800 rounded-lg p-3 outline-none text-sm text-teal-400 font-bold">
               <option value="2026">2026</option><option value="2025">2025</option>
            </select>
         </div>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 border-b border-gray-800 font-black uppercase text-[10px] tracking-widest text-gray-500">
              <tr>
                <th className="p-5">Employee</th>
                <th className="p-5">Gross Earnings</th>
                <th className="p-5">Total Deductions</th>
                <th className="p-5">Net Salary</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan="6" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-500" size={40} /></td></tr>
              ) : employees.map((emp) => {
                
                // SAFETY: s exists aur values fallback to 0
                const s = salaries.find(sal => sal.employee?._id === emp._id);
                const gross = s ? ((s.basic || 0) + (s.hra || 0) + (s.allowances || 0)) : 0;
                const totalDeduct = s ? ((s.pf || 0) + (s.tax || 0) + (s.deductions || 0)) : 0;
                const netSal = s ? (s.netSalary || 0) : 0;

                return (
                  <tr key={emp._id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="p-5">
                       <div className="font-bold text-gray-200 group-hover:text-teal-400 transition-colors">{emp.name || 'Unknown'}</div>
                       <div className="text-[9px] text-gray-500 uppercase font-black tracking-tighter">Current View: {month} {year}</div>
                    </td>

                    {s ? (
                      <>
                        <td className="p-5 font-mono text-green-400">₹{gross.toFixed(0)}</td>
                        <td className="p-5 font-mono text-red-400">₹{totalDeduct.toFixed(0)}</td>
                        <td className="p-5">
                           <div className="text-lg font-black text-white">₹{netSal.toFixed(0)}</div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {s.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-5">
                           <div className="flex justify-center gap-1">
                             <button onClick={() => downloadPayslip(s)} className="p-2 hover:bg-teal-500/10 text-teal-400 rounded-lg transition-all" title="Download Slip">
                               <Download size={18} />
                             </button>
                             {s.status !== 'Paid' && (
                               <button onClick={() => handleMarkAsPaid(s._id)} className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-all" title="Mark Paid">
                                 <CheckCircle size={18} />
                               </button>
                             )}
                           </div>
                        </td>
                      </>
                    ) : (
                      <td colSpan="5" className="p-5 text-center">
                         <button 
                          onClick={() => handleGenerate(emp._id)}
                          className="bg-teal-500/5 text-teal-400/50 border border-teal-500/10 px-8 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-teal-500 hover:text-black hover:border-teal-500 transition-all"
                         >
                           Click to Calculate {month} Salary
                         </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;