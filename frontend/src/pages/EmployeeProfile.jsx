import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Building, IndianRupee, Calendar } from 'lucide-react';
import API from '../api/axios';

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return;

        const { data } = await API.get(`/employees/${userInfo._id}`);
        setEmployee(data.employee);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!employee) return <div className="text-white text-center mt-20">Profile not found.</div>;

  const user = employee; // baaki JSX mein 'user' hi use hoga, isliye rename kar diya

  // ... yahan se neeche ka poora JSX (return wala part) waisa hi rahega

  return (
    <div className="p-4 md:p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My <span className="text-teal-400">Profile</span></h1>
        <p className="text-gray-400 mt-1">Welcome back, {user.name}! Yahan aapki details hain.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Personal Info Card */}
        <div className="lg:col-span-1 bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-xl h-fit">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mb-4 border-2 border-teal-500/30">
              <User className="w-12 h-12 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs font-bold rounded-full mt-2 uppercase tracking-widest">
              {user.role}
            </span>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="text-sm font-medium">{user.department?.name || 'Not Assigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Work & Finance Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Work Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Job Details</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Designation: <span className="text-white font-medium">{user.designation?.name || 'Not Assigned'}</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Status: <span className="text-green-400 font-medium">Active</span>
              </p>
            </div>

            <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-teal-500/10 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold">Financials</h3>
              </div>
              <p className="text-sm text-gray-400">
                Base Salary: <span className="text-white font-medium">₹{user.salaryStructure?.grossSalary?.toLocaleString() || '0'}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2 italic">*Monthly fixed pay before deductions.</p>
            </div>
          </div>

          {/* Upcoming Sections Placeholder */}
          <div className="bg-[#111827] p-8 rounded-2xl border border-dashed border-gray-700 text-center">
            <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Attendance & Activity</h3>
            <p className="text-gray-500 text-sm mt-2">
              Hamara agla step is section ko activate karna hai jahan aap punch-in aur daily logs dekh sakenge.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;