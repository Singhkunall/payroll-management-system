import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { BarChart3, PieChart, FileDown, Calendar, Star } from 'lucide-react';

// --- FIXED IMPORTS ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct import for stability

const HolidayReport = () => {
  const [reportData, setReportData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/holidays/admin-report/${year}`);
      setReportData(data);
    } catch (error) {
      console.error("Report fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, [year]);

  // --- FIXED PDF EXPORT LOGIC ---
  const handleExportPDF = () => {
    if (!reportData) return;

    try {
      const doc = new jsPDF();

      // Header Design
      doc.setFillColor(17, 24, 39); // Dark background like your theme
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(20, 184, 166); // Teal Color
      doc.text("PAYLYNX", 14, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`Holiday Analysis Report - ${year}`, 14, 30);

      // Summary section
      doc.setTextColor(0, 0, 0); // Reset to black for body
      doc.setFontSize(12);
      doc.text(`Total Holidays: ${reportData.summary.total}`, 14, 50);
      doc.text(`National: ${reportData.summary.national} | Optional: ${reportData.summary.optional} | Paid: ${reportData.summary.paid}`, 14, 58);
      
      // Table Data preparation
      const tableColumn = ["Holiday Name", "Date", "Category", "Status"];
      const tableRows = reportData.holidays.map(h => [
        h.name,
        new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        h.type,
        h.isPaid ? "Paid" : "Unpaid"
      ]);

      // FIX: Calling autoTable as a separate function instead of doc.autoTable
      autoTable(doc, {
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        headStyles: { fillColor: [20, 184, 166], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 70 }
      });

      // Save PDF
      doc.save(`PayLynx_Holiday_Report_${year}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Could not generate PDF. Please check console.");
    }
  };

  if (loading) return <div className="p-8 text-white">Generating Report...</div>;

  const stats = [
    { label: 'Total Holidays', value: reportData?.summary.total, color: 'text-teal-400', icon: <Calendar /> },
    { label: 'National', value: reportData?.summary.national, color: 'text-orange-400', icon: <Star /> },
    { label: 'Optional', value: reportData?.summary.optional, color: 'text-blue-400', icon: <PieChart /> },
    { label: 'Paid Days', value: reportData?.summary.paid, color: 'text-green-400', icon: <BarChart3 /> },
  ];

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Holiday <span className="text-teal-400">Analysis Report</span></h2>
          <p className="text-gray-500 font-medium">Detailed breakdown of holidays for the year {year}</p>
        </div>
        <div className="flex gap-4">
            <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="bg-slate-900 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
            >
                <option value="2025">Year 2025</option>
                <option value="2026">Year 2026</option>
                <option value="2027">Year 2027</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all"
            >
                <FileDown size={18} /> Export PDF
            </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#111827] border border-gray-800 p-6 rounded-3xl shadow-xl">
            <div className={`${s.color} mb-3`}>{s.icon}</div>
            <h3 className="text-3xl font-black">{s.value}</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* DETAILED TABLE */}
      <div className="bg-[#111827] border border-gray-800 rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-black uppercase text-sm tracking-widest text-gray-400">Yearly Breakdown</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="p-5">Holiday Name</th>
              <th className="p-5">Date</th>
              <th className="p-5">Category</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reportData?.holidays.map((h, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-all">
                <td className="p-5 font-bold text-teal-400">{h.name}</td>
                <td className="p-5 text-sm text-gray-300">
                    {new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-5">
                    <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-gray-400 border border-gray-700">
                        {h.type}
                    </span>
                </td>
                <td className="p-5">
                    {h.isPaid ? 
                        <span className="text-green-500 text-[10px] font-black italic uppercase bg-green-500/10 px-2 py-1 rounded">Paid</span> : 
                        <span className="text-red-500 text-[10px] font-black italic uppercase bg-red-500/10 px-2 py-1 rounded">Unpaid</span>
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HolidayReport;