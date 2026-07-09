import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Phone, Landmark, CreditCard, Lock, Save } from 'lucide-react';

const ProfileSettings = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [contactForm, setContactForm] = useState({
    phone: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    panNumber: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/employees/${userInfo._id}`);
        const emp = data.employee;
        setEmployee(emp);
        setContactForm({
          phone: emp.phone || '',
          accountNumber: emp.bankDetails?.accountNumber || '',
          ifscCode: emp.bankDetails?.ifscCode || '',
          bankName: emp.bankDetails?.bankName || '',
          panNumber: emp.panNumber || ''
        });
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleContactUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/employees/${userInfo._id}`, {
        phone: contactForm.phone,
        panNumber: contactForm.panNumber,
        bankDetails: {
          accountNumber: contactForm.accountNumber,
          ifscCode: contactForm.ifscCode,
          bankName: contactForm.bankName
        }
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
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

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="p-4 md:p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile <span className="text-teal-400">Settings</span></h1>
        <p className="text-gray-400 mt-1">Update your contact details and password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Contact Info Form */}
        <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <User className="text-teal-400" size={20} /> Contact Information
          </h3>
          <form onSubmit={handleContactUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 text-gray-600" size={18} />
                <input
                  type="text"
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">PAN Number</label>
              <div className="relative mt-1">
                <CreditCard className="absolute left-3 top-3 text-gray-600" size={18} />
                <input
                  type="text"
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none"
                  value={contactForm.panNumber}
                  onChange={(e) => setContactForm({ ...contactForm, panNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bank Name</label>
              <div className="relative mt-1">
                <Landmark className="absolute left-3 top-3 text-gray-600" size={18} />
                <input
                  type="text"
                  className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 pl-10 focus:border-teal-500 outline-none"
                  value={contactForm.bankName}
                  onChange={(e) => setContactForm({ ...contactForm, bankName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Account Number</label>
              <input
                type="text"
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
                value={contactForm.accountNumber}
                onChange={(e) => setContactForm({ ...contactForm, accountNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">IFSC Code</label>
              <input
                type="text"
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
                value={contactForm.ifscCode}
                onChange={(e) => setContactForm({ ...contactForm, ifscCode: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
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
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full bg-[#0a0f1a] border border-gray-800 rounded-xl p-3 focus:border-teal-500 outline-none"
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