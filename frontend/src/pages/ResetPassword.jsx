import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Lock, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams(); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/reset-password', { token, password });
      toast.success(data.message || "Password updated successfully!");
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or Expired Token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-white">
        <div className="text-center mb-8">
          <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
            <ShieldCheck className="text-teal-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Set New Password</h2>
          <p className="text-slate-400 text-sm mt-2">Enter a strong new password for your admin account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-slate-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-teal-400 transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-teal-400 transition-all shadow-lg"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;