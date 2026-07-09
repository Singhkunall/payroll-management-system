import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { Plus, Trash2, Briefcase, X, Building2 } from 'lucide-react';

const Designations = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]); // Dropdown ke liye
  const [showModal, setShowModal] = useState(false);
  const [newDesig, setNewDesig] = useState({ name: '', department: '', description: '' });

  const fetchData = async () => {
    try {
      const desigRes = await API.get('/designations');
      const deptRes = await API.get('/departments');
      if (desigRes.data.success) setDesignations(desigRes.data.designations);
      if (deptRes.data.success) setDepartments(deptRes.data.departments);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/designations/add', newDesig);
      if (data.success) {
        setShowModal(false);
        setNewDesig({ name: '', department: '', description: '' });
        fetchData();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add designation"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this designation?")) {
      await API.delete(`/designations/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Manage <span className="text-teal-400">Designations</span></h2>
          <p className="text-gray-400">Define roles and link them to departments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-2xl transition-all">
          <Plus size={20} /> Add Designation
        </button>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-500 text-xs uppercase font-bold tracking-widest">
            <tr>
              <th className="p-5 border-b border-gray-800">Designation</th>
              <th className="p-5 border-b border-gray-800">Department</th>
              <th className="p-5 border-b border-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {designations.map((desig) => (
              <tr key={desig._id} className="hover:bg-gray-800/20">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <Briefcase size={20} className="text-teal-400" />
                    <span className="font-bold">{desig.name}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-medium text-gray-300">
                    {desig.department?.name || 'Unassigned'}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleDelete(desig._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">New Designation</h3>
              <button onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Designation Name</label>
                <input type="text" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 outline-none focus:border-teal-500" placeholder="e.g. Senior Manager" value={newDesig.name} onChange={(e) => setNewDesig({...newDesig, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Select Department</label>
                <select required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 outline-none focus:border-teal-500" value={newDesig.department} onChange={(e) => setNewDesig({...newDesig, department: e.target.value})}>
                  <option value="">Choose Department...</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-teal-500 text-slate-950 font-black py-4 rounded-xl">Create Designation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Designations;