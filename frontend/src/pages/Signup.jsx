import React, { useState, useEffect } from 'react'; // useEffect add kiya
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Agar user pehle se login hai toh use signup page nahi dikhna chahiye
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup-admin', formData);
      
      if (data.success) {
        toast.success("Admin Account Created Successfully! Please login now.");
        // Signup ke baad seedha login page par bhejna
        navigate('/'); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
            <ShieldCheck className="text-teal-400 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Register</h2>
          <p className="text-gray-400 mt-2 text-sm">Create your master admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-teal-400 outline-none transition-all"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-teal-400 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
            <input 
              type="password" placeholder="Master Password" required
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-teal-400 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-teal-500 text-[#0f172a] font-bold py-3 rounded-xl hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
          >
            {loading ? "Creating..." : "Sign Up as Admin"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account? <Link to="/" className="text-teal-400 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;