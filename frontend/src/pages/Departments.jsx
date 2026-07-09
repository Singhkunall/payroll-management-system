import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Trash2, Building2, Search, X } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });

  const fetchDepartments = async () => {
    try {
      const { data } = await API.get('/departments');
      if (data.success) setDepartments(data.departments);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/departments/add', newDept);
      if (data.success) {
        alert("Department Added!");
        setShowModal(false);
        setNewDept({ name: '', description: '' });
        fetchDepartments();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete the department.")) {
      try {
        await API.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Manage <span className="text-teal-400">Departments</span></h2>
          <p className="text-gray-400">Add or remove company departments</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/50 text-gray-500 text-xs uppercase font-bold tracking-widest">
              <th className="p-5 border-b border-gray-800">Department Name</th>
              <th className="p-5 border-b border-gray-800">Description</th>
              <th className="p-5 border-b border-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-800/20 transition-all">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                      <Building2 size={20} />
                    </div>
                    <span className="font-bold text-lg">{dept.name}</span>
                  </div>
                </td>
                <td className="p-5 text-gray-400 text-sm">{dept.description || 'No description'}</td>
                <td className="p-5 text-center">
                  <button 
                    onClick={() => handleDelete(dept._id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {departments.length === 0 && (
          <div className="p-20 text-center text-gray-600 font-medium italic">
            No departments found. Start by adding one!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">New Department</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
                  placeholder="e.g. IT, HR, Marketing"
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Description</label>
                <textarea 
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none h-24"
                  placeholder="Tell us about this department"
                  value={newDept.description}
                  onChange={(e) => setNewDept({...newDept, description: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-xl transition-all"
              >
                {loading ? 'Adding...' : 'Create Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;