import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { UserPlus, Edit, Trash2, Phone, IndianRupee, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await API.get('/employees/all');
        // Note: Backend response structure check kar lena
        setEmployees(Array.isArray(data) ? data : data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Employees load nahi ho paye");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, kya aap sach mein is employee ko nikalna chahte ho?")) {
      try {
        await API.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
        toast.success("Employee removed successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Delete karne mein dikkat aayi");
      }
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">Employee <span className="text-teal-400">Directory</span></h2>
          <p className="text-gray-500 text-sm">Manage your workforce and their assignments</p>
        </div>
        <Link
          to="/add-employee"
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-teal-500/20 uppercase text-xs tracking-widest"
        >
          <UserPlus size={18} />
          Add New Employee
        </Link>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1f2937]/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-5">Basic Info</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Position</th>
                <th className="px-6 py-5 text-center">Shift</th>
                <th className="px-6 py-5">Base Salary</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20 text-gray-500 animate-pulse">Fetching records...</td></tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-teal-500/[0.02] transition-colors group">
                    {/* 1. Name & Email */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-white group-hover:text-teal-400 transition-colors">{emp.name}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{emp.email}</div>
                    </td>

                    {/* 2. Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone size={14} className="text-gray-600" />
                        {emp.phone || 'N/A'}
                      </div>
                    </td>

                    {/* 3. Dept & Desig */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-300">
                        {emp.designation?.name || 'N/A'}
                      </div>
                      <div className="text-[10px] uppercase text-teal-500/70 font-bold tracking-wider">
                        {emp.department?.name || 'N/A'}
                      </div>
                    </td>

                    {/* 4. Shift */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-500/20">
                        <Clock size={12} />
                        {emp.shift?.name || 'No Shift'}
                      </span>
                    </td>

                    {/* 5. Salary */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm font-mono text-green-400 font-bold">
                        <IndianRupee size={14} />
                        {emp.baseSalary?.toLocaleString() || '0'}
                      </div>
                    </td>

                    {/* 6. Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/edit-employee/${emp._id}`}
                          className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all p-2 rounded-xl"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all p-2 rounded-xl"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-20 text-gray-500">No employees found in the directory.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;