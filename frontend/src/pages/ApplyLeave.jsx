import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigation ke liye
import API from '../api/axios';
import { PlaneTakeoff, Calendar, AlignLeft, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ApplyLeave = () => {
  const navigate = useNavigate(); // Hook initialize kiya
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const employeeId = user?._id || user?.id;

  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    employee: employeeId,
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data } = await API.get('/leaves/policies');
        setPolicies(data);
      } catch (err) { toast.error("Policies load nahi ho payi"); }
    };
    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leaves/apply', formData);
      toast.success("Leave application bhej di gayi hai!");
      // Application ke baad automatic dashboard bhej sakte hain
      setTimeout(() => navigate('/dashboard'), 2000); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Apply karne mein error aaya");
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white flex flex-col items-center">
      
      {/* --- BACK BUTTON & HEADER --- */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)} // Ek step piche jane ke liye
          className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors font-bold uppercase text-xs"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <div className="bg-[#111827] border border-gray-800 p-10 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">
            Apply <span className="text-teal-400">Leave</span>
          </h2>
          <p className="text-gray-500 mb-8 text-sm">Apni chutti ki details bharo aur approval ka intezar karo.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1 text-left">Leave Type</label>
              <select 
                className="w-full bg-slate-900 border border-gray-800 rounded-xl p-4 text-white focus:border-teal-400 outline-none appearance-none"
                value={formData.leaveType}
                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                required
              >
                <option value="">Select Leave Type</option>
                {policies.map(p => <option key={p._id} value={p.name}>{p.name} ({p.days} Days)</option>)}
              </select>
            </div>

            {/* Dates and other fields remain the same... */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1 text-left">Start Date</label>
              <input 
                type="date"
                className="w-full bg-slate-900 border border-gray-800 rounded-xl p-4 text-white focus:border-teal-400 outline-none"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1 text-left">End Date</label>
              <input 
                type="date"
                className="w-full bg-slate-900 border border-gray-800 rounded-xl p-4 text-white focus:border-teal-400 outline-none"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                required
              />
            </div>

            <div className="md:col-span-2 text-left">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1">Reason for Leave</label>
              <textarea 
                className="w-full bg-slate-900 border border-gray-800 rounded-xl p-4 text-white focus:border-teal-400 outline-none h-32"
                placeholder="Mention valid reason..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="md:col-span-2 bg-teal-500 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest mt-4">
              <Send size={20} /> Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;