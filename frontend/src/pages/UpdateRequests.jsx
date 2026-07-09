import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';

const UpdateRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fieldLabels = {
    phone: 'Phone Number',
    panNumber: 'PAN Number',
    bankAccountNumber: 'Account Number',
    bankIfscCode: 'IFSC Code',
    bankName: 'Bank Name'
  };

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/update-requests/all');
      setRequests(data.requests);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/update-requests/${id}/approve`);
      toast.success("Request approved and employee updated!");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await API.put(`/update-requests/${id}/reject`, { adminNote: '' });
      toast.success("Request rejected");
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    } finally {
      setProcessingId(null);
    }
  };

  const statusBadge = (status) => {
    if (status === 'Pending') return <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded-full"><Clock size={12}/> Pending</span>;
    if (status === 'Approved') return <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full"><CheckCircle size={12}/> Approved</span>;
    return <span className="flex items-center gap-1 text-red-400 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full"><XCircle size={12}/> Rejected</span>;
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const otherRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="p-4 md:p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Update <span className="text-teal-400">Requests</span></h1>
        <p className="text-gray-400 mt-1">Review and approve employee profile change requests.</p>
      </div>

      {/* Pending Requests */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-yellow-400">Pending ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div key={req._id} className="bg-[#111827] border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center">
                    <User className="text-teal-400" size={18} />
                  </div>
                  <div>
                    <p className="font-bold">{req.employee?.name} <span className="text-gray-500 font-normal text-sm">({req.employee?.email})</span></p>
                    <p className="text-sm text-gray-400 mt-1">
                      {fieldLabels[req.fieldName]}: <span className="line-through text-gray-600">{req.oldValue || 'empty'}</span> → <span className="text-teal-400 font-medium">{req.newValue}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(req._id)}
                    disabled={processingId === req._id}
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold px-4 py-2 rounded-lg text-sm border border-green-500/30 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    disabled={processingId === req._id}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-lg text-sm border border-red-500/30 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-400">History</h3>
        {otherRequests.length === 0 ? (
          <p className="text-gray-500 text-sm">No past requests.</p>
        ) : (
          <div className="space-y-2">
            {otherRequests.map((req) => (
              <div key={req._id} className="bg-[#111827]/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{req.employee?.name}</p>
                  <p className="text-xs text-gray-500">{fieldLabels[req.fieldName]}: {req.oldValue || 'empty'} → {req.newValue}</p>
                </div>
                {statusBadge(req.status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateRequests;