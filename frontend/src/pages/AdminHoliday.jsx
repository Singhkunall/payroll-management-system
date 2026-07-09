
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { Calendar, Plus, Trash2, CheckCircle, XCircle, Info } from 'lucide-react';

const AdminHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'National',
    isPaid: true,
    description: ''
  });

  // 1. Fetch all holidays
  const fetchHolidays = async () => {
    try {
      const { data } = await API.get('/holidays/all');
      setHolidays(data);
    } catch (error) {
      toast.error("Error fetching holidays");
      
    }
  };

  useEffect(() => { fetchHolidays(); }, []);

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/holidays/add', formData);
      alert("Holiday Added Successfully!");
      setFormData({ name: '', date: '', type: 'National', isPaid: true, description: '' });
      fetchHolidays(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding holiday");
    }
  };

  // 3. Delete Holiday Function
  const deleteHoliday = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await API.delete(`/holidays/${id}`);
        fetchHolidays(); // Refresh list after delete
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting holiday");
      }
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Calendar className="text-teal-500" /> Holiday Management
          </h2>
          <p className="text-slate-500 mt-1 italic text-sm">Create and manage your organization's official calendar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- ADD HOLIDAY FORM --- */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Plus size={20} className="text-teal-500" /> Add New Holiday
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Holiday Name</label>
              <input 
                type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 mt-1 focus:outline-none focus:border-teal-500 transition-all text-white"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Diwali"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Date</label>
              <input 
                type="date" required className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 mt-1 focus:outline-none focus:border-teal-500 transition-all text-white"
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Type</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 mt-1 focus:outline-none focus:border-teal-500 text-white"
                value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="National">National</option>
                <option value="Optional">Optional</option>
                <option value="Company">Company</option>
                <option value="Weekend Override">Weekend Override</option>
              </select>
            </div>
            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox" checked={formData.isPaid} 
                onChange={(e) => setFormData({...formData, isPaid: e.target.checked})}
                className="w-4 h-4 accent-teal-500 cursor-pointer"
              />
              <label className="text-sm font-medium cursor-pointer">Is Paid Holiday?</label>
            </div>
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Save Holiday
            </button>
          </form>
        </div>

        {/* --- HOLIDAY LIST --- */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold italic">Holiday Calendar List</h3>
            <div className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700 flex items-center gap-1">
              <Info size={12} /> {holidays.length} Total Holidays
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-4 py-2 font-medium">Holiday</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium text-center">Paid</th>
                  <th className="px-4 py-2 font-medium text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h._id} className="bg-slate-800/30 hover:bg-slate-800/70 transition-all">
                    <td className="p-4 font-semibold text-white rounded-l-xl">{h.name}</td>
                    <td className="p-4 text-slate-300 font-mono text-sm">
                      {new Date(h.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase border ${
                        h.type === 'National' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        h.type === 'Optional' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {h.type}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {h.isPaid ? <CheckCircle size={18} className="text-green-500 mx-auto" /> : <XCircle size={18} className="text-red-500 mx-auto" />}
                    </td>
                    <td className="p-4 text-center rounded-r-xl">
                      <button 
                        onClick={() => deleteHoliday(h._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Holiday"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {holidays.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-10" />
                <p>No holidays added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHoliday;