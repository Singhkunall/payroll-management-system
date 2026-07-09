import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Umbrella, CheckCircle, PieChart, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveBalance = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const employeeId = user?._id || user?.id;

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        // 1. Saari policies le kar aao
        const { data: policies } = await API.get('/leaves/policies');
        // 2. Is employee ki saari requests le kar aao
        const { data: requests } = await API.get('/leaves/all-requests');
        
        const myApprovedLeaves = requests.filter(
          req => req.employee?._id === employeeId && req.status === 'Approved'
        );

        // 3. Calculation logic
        const balanceData = policies.map(policy => {
          const used = myApprovedLeaves
            .filter(req => req.leaveType === policy.name)
            .reduce((acc, req) => {
              const start = new Date(req.startDate);
              const end = new Date(req.endDate);
              const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
              return acc + days;
            }, 0);

          return {
            name: policy.name,
            total: policy.days,
            used: used,
            remaining: policy.days - used
          };
        });

        setBalances(balanceData);
      } catch (err) {
        toast.error("Balance fetch karne mein error!");
      } finally {
        setLoading(false);
      }
    };

    fetchBalanceData();
  }, [employeeId]);

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="mb-10">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">
          Leave <span className="text-teal-400">Balance</span>
        </h2>
        <p className="text-gray-500 text-sm">Aapki bachi hui chuttiyon ka poora hisab-kitab.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {balances.map((item, idx) => (
          <div key={idx} className="bg-[#111827] border border-gray-800 p-6 rounded-[2.5rem] relative overflow-hidden group hover:border-teal-500/50 transition-all shadow-xl">
            <div className="absolute -right-4 -top-4 text-teal-500/5 group-hover:text-teal-500/10 transition-colors">
              <Umbrella size={120} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 text-gray-200">{item.name}</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-xs font-bold uppercase">Used / Total</span>
                  <span className="text-lg font-black text-teal-400">{item.used} / {item.total}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-gray-800">
                  <div 
                    className="bg-teal-500 h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  ></div>
                </div>

                <div className="pt-4 border-t border-gray-800/50 flex justify-between items-center">
                  <span className="text-gray-400 text-sm font-medium">Remaining:</span>
                  <span className="bg-teal-500/10 text-teal-400 px-4 py-1 rounded-full text-sm font-black italic">
                    {item.remaining} Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {balances.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-gray-800 mt-10">
          <Info className="mx-auto text-gray-700 mb-4" size={40} />
          <p className="text-gray-600 italic uppercase font-bold tracking-widest text-xs">Abhi tak koi leave policies set nahi hain.</p>
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;