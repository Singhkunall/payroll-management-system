import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { Search, Edit, CheckCircle, XCircle, Clock, Save, X } from 'lucide-react';

const AttendanceMonitor = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states for Editing (Step 3)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editData, setEditData] = useState({ status: '', remark: '' });

  const fetchAllAttendance = async () => {
    try {
      const { data } = await API.get('/attendance/admin/all');
      if (data.success) {
        setRecords(data.records);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setEditData({ 
      status: record.status, 
      remark: record.remark || "Corrected by Admin" 
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await API.post('/attendance/admin/update', {
        employeeId: selectedRecord.employeeId._id,
        date: selectedRecord.date,
        status: editData.status,
        remark: editData.remark
      });
      
      if (data.success) {
        toast.success("Attendance Updated Successfully!");
        setIsModalOpen(false);
        fetchAllAttendance(); // Refresh table data
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update attendance");
    }
  };

  const filteredRecords = records.filter(rec => 
    rec.employeeId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Attendance <span className="text-teal-400">Monitor</span></h2>
          <p className="text-gray-400 mt-1">Manage and edit employee daily records</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search employee..."
            className="bg-[#111827] border border-gray-800 rounded-2xl py-3 pl-10 pr-4 w-full md:w-80 focus:outline-none focus:border-teal-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <th className="p-5 border-b border-gray-800">Employee</th>
              <th className="p-5 border-b border-gray-800">Date</th>
              <th className="p-5 border-b border-gray-800">Punch In/Out</th>
              <th className="p-5 border-b border-gray-800">Status</th>
              <th className="p-5 border-b border-gray-800">Source</th>
              <th className="p-5 border-b border-gray-800 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {filteredRecords.map((rec) => (
              <tr key={rec._id} className="hover:bg-gray-800/30 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {rec.employeeId?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{rec.employeeId?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter">{rec.employeeId?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-gray-300 font-medium">{rec.date}</td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-teal-400 font-bold">↓ {rec.punchIn || '--:--'}</span>
                    <span className="text-red-400 font-bold">↑ {rec.punchOut || '--:--'}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    rec.status === 'Present' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    rec.status === 'Late' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    rec.status === 'Leave' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {rec.status}
                  </span>
                </td>
                <td className="p-5">
                  <span className={`text-xs px-2 py-0.5 rounded-md ${rec.markedBy === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-500 italic'}`}>
                    {rec.markedBy === 'Self' ? '💻 Self' : '🛡️ Admin'}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button 
                    onClick={() => handleEditClick(rec)}
                    className="p-2 hover:bg-teal-500/20 text-teal-400 rounded-xl transition-all"
                    title="Edit Status"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecords.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No records found.</p>
          </div>
        )}
      </div>

      {/* STEP 3: EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Attendance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Status</label>
                <select 
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 text-white focus:border-teal-500 outline-none"
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Remark (Reason)</label>
                <textarea 
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 text-white focus:border-teal-500 outline-none h-24"
                  placeholder="Why are you changing this record?"
                  value={editData.remark}
                  onChange={(e) => setEditData({...editData, remark: e.target.value})}
                ></textarea>
              </div>

              <button 
                onClick={handleUpdate}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <Save size={20} /> Update Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceMonitor;