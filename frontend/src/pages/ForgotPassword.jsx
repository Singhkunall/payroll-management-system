import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Hamare naye backend route '/auth/forgot-password' ko hit karega
      const { data } = await API.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        {/* Wapas jane ka rasta */}
        <Link to="/" className="text-teal-400 flex items-center gap-2 mb-6 text-sm hover:underline">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <h2 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password?</h2>
        <p className="text-slate-400 text-sm mb-8 text-center">
          Enter the admin email and we'll send you a link to reset your password.
        </p>

        {message ? (
          <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl text-sm border border-emerald-500/20 text-center">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Admin Email Address" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-teal-400 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-teal-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;