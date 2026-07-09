import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Clock, Plus, Trash2, Calendar, Edit } from 'lucide-react'; // Edit icon add kiya
import { toast } from 'react-hot-toast';

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // Edit track karne ke liye
  const [formData, setFormData] = useState({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    lateGraceTime: 15
  });

  // Shifts load karne ke liye
  const fetchShifts = async () => {
    try {
      const { data } = await API.get('/shifts/all');
      setShifts(data);
    } catch (error) {
      toast.error("Error loading shifts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShifts(); }, []);

  // Modal open karne ka logic (Add vs Edit)
  const openModal = (shift = null) => {
    if (shift) {
      setEditingId(shift._id);
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        lateGraceTime: shift.lateGraceTime
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', startTime: '09:00', endTime: '18:00', lateGraceTime: 15 });
    }
    setShowModal(true);
  };

  // Form Submit handler (Create + Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE LOGIC
        await API.put(`/shifts/${editingId}`, formData);
        toast.success("Shift Updated!");
      } else {
        // CREATE LOGIC
        await API.post('/shifts/add', formData);
        toast.success("Shift Created!");
      }
      setShowModal(false);
      fetchShifts(); 
    } catch (error) {
      toast.error(editingId ? "Failed to update shift" : "Failed to create shift");
    }
  };

  // DELETE LOGIC
  const handleDelete = async (id) => {
    if (window.confirm("Bhai, kya aap sach mein is shift ko delete karna chahte ho?")) {
      try {
        await API.delete(`/shifts/${id}`);
        toast.success("Shift Deleted!");
        fetchShifts();
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting shift");
      }
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Shift <span className="text-teal-400">Master</span></h2>
          <p className="text-gray-500">Manage company work timings</p>
        </div>
        <button 
          onClick={() => openModal()} // Change: openModal use kiya
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add Shift
        </button>
      </div>

      {/* SHIFT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shifts.map((s) => (
          <div key={s._id} className="bg-[#111827] border border-gray-800 p-6 rounded-[2rem] hover:border-teal-500 transition-all group relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400"><Clock size={24} /></div>
              <h3 className="text-xl font-bold">{s.name}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between"><span>Start:</span> <span className="text-white font-mono">{s.startTime}</span></div>
              <div className="flex justify-between"><span>End:</span> <span className="text-white font-mono">{s.endTime}</span></div>
              <div className="flex justify-between border-t border-gray-800 pt-2 mt-2">
                <span>Grace:</span> <span className="text-orange-400 font-bold">{s.lateGraceTime} mins</span>
              </div>
            </div>

            {/* ACTION BUTTONS (Edit & Delete) */}
            <div className="flex gap-2 mt-4 justify-end">
              <button 
                onClick={() => openModal(s)}
                className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                title="Edit Shift"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(s._id)}
                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                title="Delete Shift"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT SHIFT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111827] border border-gray-800 p-8 rounded-[2.5rem] w-full max-w-md">
            <h2 className="text-2xl font-black mb-6 uppercase">
              {editingId ? 'Edit' : 'New'} <span className="text-teal-400">Shift</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Shift Name</label>
                <input 
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white focus:border-teal-400 outline-none"
                  placeholder="e.g., Morning Shift"
                  value={formData.name} // Added value for editing
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Start Time</label>
                  <input type="time" className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white" 
                    value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">End Time</label>
                  <input type="time" className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white" 
                    value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Late Grace (Mins)</label>
                <input type="number" className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white" 
                  value={formData.lateGraceTime} onChange={(e) => setFormData({...formData, lateGraceTime: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 p-3 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-500 text-slate-950 p-3 rounded-xl font-bold">
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shifts;