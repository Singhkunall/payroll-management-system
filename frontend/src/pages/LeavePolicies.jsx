import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { ShieldCheck, Plus, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeavePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    days: '',
    description: ''
  });

  // Fetch Policies
  const fetchPolicies = async () => {
    try {
      const { data } = await API.get('/leaves/policies');
      setPolicies(data);
    } catch (error) {
      toast.error("Policies load nahi ho payi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolicies(); }, []);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/leaves/policies/add', formData);
      toast.success("Nayi Policy ban gayi!");
      setShowModal(false);
      setFormData({ name: '', days: '', description: '' });
      fetchPolicies();
    } catch (error) {
      toast.error("Policy banane mein error aaya");
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Bhai, kya aap sach mein ye policy delete karna chahte ho?")) {
      try {
        await API.delete(`/leaves/policies/${id}`);
        toast.success("Policy hat gayi!");
        fetchPolicies();
      } catch (error) {
        toast.error("Delete nahi ho paya");
      }
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Leave <span className="text-teal-400">Policies</span></h2>
          <p className="text-gray-500">Define how many leaves employees get per year</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus size={20} /> Add New Policy
        </button>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {policies.map((p) => (
          <div key={p._id} className="bg-[#111827] border border-gray-800 p-6 rounded-[2rem] hover:border-teal-500 transition-all relative group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold">{p.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Max Allowance:</span>
                <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-xs font-bold">
                  {p.days} Days / Year
                </span>
              </div>
              <p className="text-gray-400 text-sm italic">"{p.description || 'No description provided'}"</p>
            </div>

            <button 
              onClick={() => handleDelete(p._id)}
              className="absolute top-6 right-6 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Policy Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111827] border border-gray-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6 uppercase italic">Create <span className="text-teal-400">Policy</span></h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1">Policy Name</label>
                <input 
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-all"
                  placeholder="e.g., Sick Leave"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1">Number of Days</label>
                <input 
                  type="number"
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-all"
                  placeholder="e.g., 12"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2 ml-1">Description (Optional)</label>
                <textarea 
                  className="w-full bg-slate-900 border border-gray-800 rounded-xl p-3 text-white focus:border-teal-400 outline-none transition-all h-24"
                  placeholder="Explain the policy rules..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-800 p-3 rounded-xl font-bold hover:bg-gray-700 transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-teal-500 text-slate-950 p-3 rounded-xl font-bold hover:bg-teal-400 transition-all">Create Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicies;