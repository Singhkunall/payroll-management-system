import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { UserPlus, Building2, Briefcase, Mail, Smartphone, Edit3 } from 'lucide-react';

const EditEmployee = () => {
    const { id } = useParams(); // URL se ID nikalne ke liye
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', role: 'Employee',
        department: '', designation: '', phone: '', baseSalary: ''
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Purana data aur dropdowns fetch karna
    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const [deptRes, desigRes, empRes] = await Promise.all([
                    API.get('/departments'),
                    API.get('/designations'),
                    API.get(`/employees/${id}`)
                ]);

                setDepartments(deptRes.data.departments);
                setDesignations(desigRes.data.designations);
                
                // Form mein purana data bharna
                const emp = empRes.data.employee;
                setFormData({
                    name: emp.name,
                    email: emp.email,
                    role: emp.role,
                    department: emp.department?._id || emp.department,
                    designation: emp.designation?._id || emp.designation,
                    phone: emp.phone || '',
                    baseSalary: emp.baseSalary || ''
                });
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Data load nahi ho paya!");
            }
        };
        fetchMetaData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Hum .put method use karenge update ke liye
            await API.put(`/employees/${id}`, formData);
            toast.success("Employee updated successfully!");
            navigate('/employees');
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
            <div className="max-w-4xl mx-auto bg-[#111827] border border-gray-800 p-8 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Edit3 className="text-teal-400" size={32} /> Edit <span className="text-teal-400">Employee Details</span>
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                            <input type="text" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            <UserPlus className="absolute left-3 top-3.5 text-gray-600" size={18} />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                            <input type="email" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            <Mail className="absolute left-3 top-3.5 text-gray-600" size={18} />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                        <div className="relative">
                            <input type="text" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                placeholder="+91 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            <Smartphone className="absolute left-3 top-3.5 text-gray-600" size={18} />
                        </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department</label>
                        <div className="relative">
                            <select required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none appearance-none cursor-pointer"
                                value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                <option value="">Select Department</option>
                                {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                            </select>
                            <Building2 className="absolute left-3 top-3.5 text-gray-600" size={18} />
                        </div>
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Designation</label>
                        <div className="relative">
                            <select required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none appearance-none cursor-pointer"
                                value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })}>
                                <option value="">Select Designation</option>
                                {designations.map(des => (
                                    <option key={des._id} value={des._id}>{des.name}</option>
                                ))}
                            </select>
                            <Briefcase className="absolute left-3 top-3.5 text-gray-600" size={18} />
                        </div>
                    </div>

                    {/* Base Salary */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Base Salary</label>
                        <div className="relative">
                            <input type="number" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                placeholder="e.g. 50000" value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })} />
                            <span className="absolute left-3 top-3.5 text-gray-600 font-bold">₹</span>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="md:col-span-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-2xl transition-all mt-4 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50">
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditEmployee;