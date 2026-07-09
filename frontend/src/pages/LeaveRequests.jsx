import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/leaves/all-requests');
      setRequests(data);
    } catch (error) {
      toast.error("Requests load nahi ho payi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  // Handle Approve/Reject
  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/leaves/status/${id}`, { status });
      toast.success(`Leave ${status} ho gayi!`);
      fetchRequests(); // List refresh karo
    } catch (error) {
      toast.error("Status update karne mein galti hui");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-400 bg-green-400/10';
      case 'Rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight italic">Leave <span className="text-teal-400">Requests</span></h2>
        <p className="text-gray-500 text-sm">Review and manage employee leave applications</p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-gray-800">
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">Employee</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">Leave Type</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">Duration</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">Reason</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic">Status</th>
              <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-widest italic text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400"><User size={18}/></div>
                    <div>
                      <p className="font-bold text-gray-200">{req.employee?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{req.employee?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-gray-300">
                    {req.leaveType}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex flex-col text-sm text-gray-400">
                    <span>{new Date(req.startDate).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-600 uppercase font-bold">to</span>
                    <span>{new Date(req.endDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-5 max-w-[200px]">
                  <p className="text-sm text-gray-400 truncate italic" title={req.reason}>"{req.reason}"</p>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-5">
                  {req.status === 'Pending' ? (
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Approved')}
                        className="p-2 hover:bg-green-500/20 text-green-500 rounded-xl transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={22} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                        title="Reject"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-600 text-xs font-bold italic uppercase">Processed</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {requests.length === 0 && !loading && (
          <div className="p-20 text-center text-gray-600 italic">
            <Clock className="mx-auto mb-4 opacity-20" size={48} />
            Abhi tak koi leave request nahi aayi hai...
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;