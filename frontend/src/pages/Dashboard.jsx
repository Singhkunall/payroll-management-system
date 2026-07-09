import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, Building2, TrendingUp } from 'lucide-react';
import API from '../api/axios';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 p-6 rounded-3xl hover:border-teal-500/40 transition-all duration-500 group shadow-2xl hover:shadow-teal-500/10">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black mt-2 text-white group-hover:text-teal-400 transition-colors duration-300">
          {value}
        </h3>
      </div>
      <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 group-hover:scale-110 transition-all duration-500 shadow-inner`}>
        <Icon className={`w-7 h-7 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await API.get('/employees/stats');
        setStats(data);
      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const COLORS = ['#2dd4bf', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  return (
    <div className="p-8 bg-[#0a0f1a] bg-gradient-to-br from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a] min-h-screen text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight">
            System <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent italic">Pulse</span>
          </h2>
          <p className="text-slate-500 mt-1 font-medium tracking-wide">Real-time workforce analytics & distribution</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-300 uppercase">Live Database Connected</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <StatCard
          title="Total Personnel"
          value={stats.totalEmployees}
          icon={Users}
          colorClass="bg-teal-500"
        />
        <StatCard
          title="Monthly Budget"
          value={`₹${stats.totalSalary.toLocaleString()}`}
          icon={DollarSign}
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Active Units"
          value={stats.totalDepartments}
          icon={Building2}
          colorClass="bg-orange-500"
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-slate-900/30 backdrop-blur-md border border-slate-800/60 p-8 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-500/10 rounded-2xl">
              <TrendingUp className="text-teal-400 w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">Department Distribution</h4>
          </div>
          {/* <div className="text-slate-500 text-xs font-mono">SC-402 // ANALYTICS_V1</div> */}
        </div>


        <div className="h-[400px]"> {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`grad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
                opacity={0.4}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                dy={15}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#2dd4bf', fontSize: '14px', fontWeight: '800' }}
              />
              <Bar 
                dataKey="value" 
                radius={[12, 12, 4, 4]} 
                barSize={55}
                animationDuration={1500}
              >
                {stats.chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#barGrad-${index % COLORS.length})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;