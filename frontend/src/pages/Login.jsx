import React, { useState, useEffect } from 'react';
import tosat from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- PEHLE YE WALA useEffect BADLIYE ---
useEffect(() => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const user = JSON.parse(userInfo);
    // Role ke hisab se dashboard decide karein
    if (user.role === 'Admin') {
      navigate('/dashboard');
    } else {
      navigate('/employee-profile');
    }
  }
}, [navigate]);

// --- handleLogin AB EKDUM SAHI HAI ---
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post('/auth/login', { email, password });
    
    localStorage.setItem('userInfo', JSON.stringify(data));

    // Yahan redirect logic ekdum perfect hai
    if (data.role === 'Admin') {
      navigate('/dashboard'); 
    } else {
      navigate('/employee-profile'); 
    }

    tosat.success(`Welcome back, ${data.name}!`);
  } catch (err) {
    tosat.error(err.response?.data?.message || "Login failed");
  }
};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-white font-sans">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Build with <span className="text-teal-400">Confidence</span>
        </h1>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold">Welcome Back</h3>
          <p className="text-slate-400 text-sm">Login to your account</p>
        </div>

        {error && <p className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white focus:outline-none focus:border-teal-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-11 pr-12 text-white focus:outline-none focus:border-teal-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* --- YE RAHA FORGOT PASSWORD LINK --- */}
            <div className="flex justify-end mt-2">
              <Link 
                to="/forgot-password" 
                className="text-xs text-teal-400 hover:underline transition-all"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-lg transition-all shadow-lg shadow-teal-500/20">
            Login
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            New admin?{' '}
            <Link to="/signup" className="text-teal-400 font-bold hover:underline transition-all">
              Create Admin Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;