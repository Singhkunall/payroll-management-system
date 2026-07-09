import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { UserPlus, Building2, Briefcase, Mail, Lock, Smartphone, Eye, EyeOff, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // navigation ke liye

const AddEmployee = () => {
    const navigate = useNavigate(); // Hook initialize kiya
    
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'Employee',
        department: '', designation: '', phone: '', baseSalary: '',
        shift: '' 
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [shifts, setShifts] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const [deptRes, desigRes, shiftRes] = await Promise.all([
                    API.get('/departments'),
                    API.get('/designations'),
                    API.get('/shifts/all') 
                ]);
                
                setDepartments(deptRes.data.departments || []);
                setDesignations(desigRes.data.designations || []);
                setShifts(shiftRes.data || []);
            } catch (err) {
                console.error("Error fetching metadata:", err);
                toast.error("Failed to load settings (Shifts/Dept)");
            }
        };
        fetchMetaData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post('/auth/signup', formData);
            if (data.success) {
                toast.success("Employee Created Successfully!");
                setFormData({ 
                    name: '', email: '', password: '', role: 'Employee', 
                    department: '', designation: '', phone: '', baseSalary: '', shift: '' 
                });
                // Chaho toh success ke baad wapas bhej sakte ho: navigate('/employees');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
            <div className="max-w-4xl mx-auto">
                {/* BACK BUTTON - Form se thoda upar */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 hover:text-teal-400 mb-6 transition-all font-bold uppercase text-xs tracking-[0.2em]"
                >
                    <ArrowLeft size={16} /> Back to Employees
                </button>

                <div className="bg-[#111827] border border-gray-800 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <UserPlus className="text-teal-400" size={32} /> Add New <span className="text-teal-400">Employee</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* 1. Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                            <div className="relative">
                                <input type="text" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                    placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <UserPlus className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* 2. Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <input type="email" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                    placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                <Mail className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* 3. Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Login Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 pr-10 focus:border-teal-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <Lock className="absolute left-3 top-3.5 text-gray-600" size={18} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-600 hover:text-teal-400">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* 4. Phone Number */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                            <div className="relative">
                                <input type="text" required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                    placeholder="+91 9876543210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                <Smartphone className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* 5. Department */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department</label>
                            <div className="relative">
                                <select required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none appearance-none cursor-pointer text-gray-300"
                                    value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                    <option value="">Select Department</option>
                                    {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                                </select>
                                <Building2 className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* 6. Designation */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Designation</label>
                            <div className="relative">
                                <select required className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none appearance-none cursor-pointer text-gray-300"
                                    value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })}>
                                    <option value="">Select Designation</option>
                                    {designations.filter(d => !formData.department || d.department?._id === formData.department).map(des => (
                                        <option key={des._id} value={des._id}>{des.name}</option>
                                    ))}
                                </select>
                                <Briefcase className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* 7. Base Salary */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Base Salary</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none transition-all"
                                    placeholder="e.g. 50000"
                                    value={formData.baseSalary}
                                    onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                                />
                                <span className="absolute left-3 top-3.5 text-gray-600 font-bold">₹</span>
                            </div>
                        </div>

                        {/* 8. Shift Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Working Shift</label>
                            <div className="relative">
                                <select 
                                    required 
                                    className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none appearance-none cursor-pointer text-gray-300"
                                    value={formData.shift} 
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                >
                                    <option value="">Select Shift</option>
                                    {shifts.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.name} ({s.startTime}-{s.endTime})
                                        </option>
                                    ))}
                                </select>
                                <Clock className="absolute left-3 top-3.5 text-gray-600" size={18} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="md:col-span-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-2xl transition-all mt-4 shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Register Employee Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;