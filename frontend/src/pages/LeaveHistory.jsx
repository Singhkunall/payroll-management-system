import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveHistory = () => {
  const [myLeaves, setMyLeaves] = useState([]);
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const employeeId = user?._id || user?.id;

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        // Hum backend se sirf is employee ki leaves mangenge
        const { data } = await API.get(`/leaves/all-requests`);
        // Filter kar rahe hain taaki sirf apni dikhen (Baad mein backend se filter karwaenge)
        const personalLeaves = data.filter(leaf => leaf.employee?._id === employeeId);
        setMyLeaves(personalLeaves);
      } catch (err) {
        toast.error("History load nahi ho saki");
      }
    };
    fetchMyLeaves();
  }, [employeeId]);

  const getStatusStyle = (status) => {
    if (status === 'Approved') return 'text-green-400 border-green-400/20 bg-green-400/5';
    if (status === 'Rejected') return 'text-red-400 border-red-400/20 bg-red-400/5';
    return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <h2 className="text-3xl font-black uppercase italic mb-8">My Leave <span className="text-teal-400">History</span></h2>
      
      <div className="grid gap-4">
        {myLeaves.length > 0 ? myLeaves.map((leaf) => (
          <div key={leaf._id} className="bg-[#111827] border border-gray-800 p-6 rounded-3xl flex items-center justify-between hover:border-gray-700 transition-all">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-slate-900 rounded-2xl text-teal-400">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{leaf.leaveType}</h3>
                <p className="text-gray-500 text-sm italic">"{leaf.reason}"</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(leaf.startDate).toLocaleDateString()} - {new Date(leaf.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={`px-6 py-2 rounded-xl border font-black uppercase tracking-widest text-xs ${getStatusStyle(leaf.status)}`}>
              {leaf.status}
            </div>
          </div>
        )) : (
          <div className="text-center py-20 text-gray-600 italic">No leaves applied yet.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;