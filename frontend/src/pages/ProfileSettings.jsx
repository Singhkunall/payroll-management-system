import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Phone, Landmark, CreditCard, Lock, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

const ProfileSettings = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [myRequests, setMyRequests] = useState([]);

  // Request modal state
  const [activeField, setActiveField] = useState(null); // konsa field abhi edit ho raha hai
  const [newValue, setNewValue] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fieldLabels = {
    phone: 'Phone Number',
    panNumber: 'PAN Number',
    bankAccountNumber: 'Account Number',
    bankIfscCode: 'IFSC Code',
    bankName: 'Bank Name'
  };

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/employees/${userInfo._id}`);
      setEmployee(data.employee);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data } = await API.get(`/update-requests/my/${userInfo._id}`);
      setMyRequests(data.requests);
    } catch (error) {
      console.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyRequests();
  }, []);

  const getCurrentValue = (fieldName) => {
    if (!employee) return '';
    if (fieldName === 'phone') return employee.phone || '';
    if (fieldName === 'panNumber') return employee.panNumber || '';
    if (fieldName === 'bankAccountNumber') return employee.bankDetails?.accountNumber || '';
    if (fieldName === 'bankIfscCode') return employee.bankDetails?.ifscCode || '';
    if (fieldName === 'bankName') return employee.bankDetails?.bankName || '';
    return '';
  };

  const openRequestForm = (fieldName) => {
    setActiveField(fieldName);
    setNewValue('');
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) {
      toast.error("Please enter a new value");
      return;
    }
    setSaving(true);
    try {
      await API.post('/update-requests/create', {
        employeeId: userInfo._id,
        fieldName: activeField,
        oldValue: getCurrentValue(activeField),
        newValue: newValue
      });
      toast.success("Request sent to Admin for approval!");
      setActiveField(null);
      fetchMyRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await API.put(`/employees/${userInfo._id}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'Pending') return <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold"><Clock size={14}/> Pending</span>;
    if (status === 'Approved') return <span className="flex items-center gap-1 text-green-400 text-xs font-bold"><CheckCircle size={14}/> Approved</span>;
    return <span className="flex items-center gap-1 text-red-400 text-xs font-bold"><XCircle size={14}/> Rejected</span>;
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  const fieldsToShow = [
    { key: 'phone', icon: <Phone size={18} /> },
    { key: 'panNumber', icon: <CreditCard size={18} /> },
    { key: 'bankName', icon: <Landmark size={18} /> },
    { key: 'bankAccountNumber', icon: null },
    { key: 'bankIfscCode', icon: null }
  ];

  return (
    <div className="p-4 md:p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile <span className="text-teal-400">Settings</span></h1>
        <p className="text-gray-400 mt-1">View your details. To update sensitive info, send a request to Admin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {/* View-only Info Card */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-xl h-fit">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <User className="text-teal-400" size={20} /> Contact Information
          </h3>
          <div className="space-y-4">
            {fieldsToShow.map(({ key }) => (
              <div key={key} className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <p className="text-xs text-gray-500">{fieldLabels[key]}</p>
                  <p className="text-sm font-medium">{getCurrentValue(key) || 'Not set'}</p>
                </div>
                <button
                  onClick={() => openRequestForm(key)}
                  className="text-xs text-teal-400 hover:underline font-bold"
                >
                  Request Change
                </button>
              </div>
            ))}
          </div>

          {/* Inline request form */}
          {activeField && (
            <form onSubmit={submitRequest} className="mt-6 bg-[#0a0f1a] border border-teal-500/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-teal-400">Request change for: {fieldLabels[activeField]}</p>
              <input
                type="text"
                autoFocus
                placeholder="Enter new value"
                className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 outline-none focus:border-teal-500"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  <Send size={14} /> {saving ? 'Sending...' : 'Send Request'}
                </button>
                <button type="button" onClick={() => setActiveField(null)} className="px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* My requests history */}
          {myRequests.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">My Requests</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {myRequests.map((req) => (
                  <div key={req._id} className="flex items-center justify-between text-sm bg-[#0a0f1a] p-2.5 rounded-lg">
                    <span className="text-gray-400">{fieldLabels[req.fieldName]} → {req.newValue}</span>
                    {statusBadge(req.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Password Change Form */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-xl h-fit">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Lock className="text-teal-400" size={20} /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none mt-1"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none mt-1"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none mt-1"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-xl transition-all border border-red-500/30 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;