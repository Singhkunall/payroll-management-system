import React, { useState } from 'react';
import API from '../api/axios';
import { X } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, setIsOpen, refreshEmployees }) => {
  // 1. Salary field add ki hai kyunki backend ne Employee model mein ise required rakha hai
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'Employee', 
    department: '', 
    designation: '', // Ye bhi add kiya
    salary: '' // Ye zaroori hai
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending Data:", formData); // Debugging ke liye
    
    try {
        // Backend ke '/auth/register' endpoint par data bhejna
        const response = await API.post('/auth/register', formData); 
        
        if(response.data.success) {
            alert("Employee saved successfully!");
            setIsOpen(false); // Modal band karne ke liye (props wala function)
            if(refreshEmployees) refreshEmployees(); // List refresh karne ke liye
        }
    } catch (err) {
        console.error("Submission Error:", err.response?.data);
        alert(err.response?.data?.message || "Error saving employee");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Add New Staff</h3>
          <button onClick={() => setIsOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Initial Password" required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <div className="flex gap-4">
            <input 
              type="text" placeholder="Designation" required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, designation: e.target.value})}
            />
            <input 
              type="number" placeholder="Salary" required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <select 
              required
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
              <option value="">Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </select>
            <select 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 transition-all">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;