import React, { useState, useEffect } from 'react';
import API from '../api/axios'; // Tumhara axios instance
import { FileText, Download, Loader2, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MyPayslips = () => {
  const [mySalaries, setMySalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPayslips = async () => {
      try {
        // API call to our new route
        const { data } = await API.get('/payroll/my-salaries');
        setMySalaries(data.salaries || []);
      } catch (err) {
        console.error("Error fetching payslips:", err);
        toast.error("Failed to load your payslips");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPayslips();
  }, []);

  // --- PDF DOWNLOADER (Same Premium Design) ---
  const downloadPayslip = (s) => {
    try {
      const doc = new jsPDF();
      const empName = s.employee?.name || 'Employee';
      const empId = s.employee?.employeeId || 'N/A';

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFontSize(24);
      doc.setTextColor(45, 212, 191);
      doc.text("PAYLYNX HRMS", 105, 25, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Official Salary Slip for ${s.month}`, 105, 50, { align: "center" });

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
          ['Basic Pay', (s.basic || 0).toFixed(2), 'Provident Fund (PF)', (s.pf || 0).toFixed(2)],
          ['HRA', (s.hra || 0).toFixed(2), 'Professional Tax (PT)', (s.tax || 0).toFixed(2)],
          ['Allowances', (s.allowances || 0).toFixed(2), 'Loss of Pay', (s.deductions || 0).toFixed(2)],
          ['', '', '', '']
        ],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] }
      });

      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text(`Net Payable: Rs. ${(s.netSalary || 0).toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);
      
      doc.save(`Payslip_${s.month}.pdf`);
      toast.success("Payslip Downloaded Successfully!");
    } catch (err) {
      toast.error("Error downloading PDF");
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20">
            <Wallet className="text-teal-400" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-widest text-white">My <span className="text-teal-400">Payslips</span></h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">View and Download your monthly salary slips</p>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-[#111827] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 border-b border-gray-800 font-black uppercase text-[10px] tracking-widest text-gray-500">
              <tr>
                <th className="p-6">Salary Month</th>
                <th className="p-6">Gross Earnings</th>
                <th className="p-6">Net Payable</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-center">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin text-teal-500 mx-auto" size={30} /></td></tr>
              ) : mySalaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <FileText className="text-gray-600 mx-auto mb-3" size={40} />
                    <p className="text-gray-500 font-bold">No payslips generated yet.</p>
                  </td>
                </tr>
              ) : (
                mySalaries.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30 transition-all">
                    <td className="p-6 font-bold text-lg text-gray-200">{s.month}</td>
                    <td className="p-6 font-mono text-gray-400">₹{((s.basic || 0) + (s.hra || 0) + (s.allowances || 0)).toFixed(0)}</td>
                    <td className="p-6 font-mono font-black text-teal-400 text-lg">₹{(s.netSalary || 0).toFixed(0)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${s.status === 'Paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => downloadPayslip(s)}
                        className="p-3 bg-teal-500/10 text-teal-400 rounded-xl hover:bg-teal-500 hover:text-slate-950 transition-all shadow-lg"
                      >
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MyPayslips;