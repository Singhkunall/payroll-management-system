import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, CheckCircle, LogIn, LogOut, Coffee, Info } from 'lucide-react';
import API from '../api/axios';

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Holiday State
  const [holidayInfo, setHolidayInfo] = useState({ isHoliday: false, holiday: null });
  const [allHolidays, setAllHolidays] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Live Clock 
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceData = async () => {
    try {
      // 1. Fetch Attendance History
      const attRes = await API.get(`/attendance/${userInfo._id}`);
      if (attRes.data.success) {
        setHistory(attRes.data.records);
        const today = new Date().toISOString().split('T')[0];
        const record = attRes.data.records.find(r => r.date === today);
        setTodayRecord(record || null);
      }

      // 2. Check if Today is Holiday
      const holidayCheck = await API.get('/holidays/check-today');
      setHolidayInfo(holidayCheck.data);

      // 3. Get All Holidays for Calendar View
      const allHolidaysRes = await API.get('/holidays/all');
      setAllHolidays(allHolidaysRes.data);

    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (userInfo) fetchAttendanceData();
  }, []);

  const handleAction = async (type) => {
    if (holidayInfo.isHoliday) return toast.error("Today is a holiday!");
    
    setLoading(true);
    const endpoint = type === 'in' ? '/attendance/clock-in' : '/attendance/clock-out';
    try {
      const response = await API.post(endpoint, { userId: userInfo._id });
      if (response.data.success) {
        toast.success(type === 'in' ? "Good Morning! Punch-In Marked." : "Good Work! Punch-Out Marked.");
        fetchAttendanceData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action Failed");
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  const getDayStatus = (day) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const dateObj = new Date(new Date().getFullYear(), new Date().getMonth(), day);
    const dateStr = dateObj.toISOString().split('T')[0];
    
    // Check if it's a holiday
    const isHoliday = allHolidays.find(h => h.date.split('T')[0] === dateStr);
    if (isHoliday) return "bg-red-500/20 border-red-500 text-red-500 font-black shadow-[0_0_15px_rgba(239,68,68,0.2)]";

    const record = history.find(r => r.date === dateStr);
    if (record) {
      if (record.status === 'Late') return "bg-yellow-500/10 border-yellow-500/50 text-yellow-500";
      return "bg-teal-500/20 border-teal-500 text-teal-400";
    }

    if (dateStr < todayStr) return "bg-slate-800/50 border-gray-900 text-gray-700";
    return "border-gray-800 text-gray-600";
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight">ATTENDANCE <span className="text-teal-400 italic">HUB</span></h2>
          <p className="text-gray-500 mt-1 font-medium">Manage your daily logs and company calendar.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Employee ID</p>
          <p className="text-teal-500 font-mono font-bold">{userInfo?.employeeId || 'N/A'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          
          {/* HOLIDAY BANNER (Shows only if today is holiday) */}
          {holidayInfo.isHoliday && (
            <div className="bg-gradient-to-br from-red-600/20 to-orange-600/10 border border-red-500/30 p-6 rounded-3xl text-center animate-pulse">
              <Coffee className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Office Closed</h3>
              <p className="text-orange-400 font-bold">{holidayInfo.holiday.name}</p>
              <p className="text-xs text-gray-400 mt-2">Enjoy your paid time off! 🥳</p>
            </div>
          )}

          {/* Live Clock Card */}
          <div className={`bg-[#111827] border ${holidayInfo.isHoliday ? 'border-red-500/20 opacity-80' : 'border-gray-800'} p-8 rounded-3xl shadow-xl text-center relative overflow-hidden`}>
            <Clock className="w-10 h-10 text-teal-400 mx-auto mb-4" />
            <h3 className="text-4xl font-black tracking-tight mb-1">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h3>
            <p className="text-gray-500 text-sm font-bold">
              {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            
            <div className="mt-8 space-y-3 relative z-10">
              <button 
                onClick={() => handleAction('in')}
                disabled={loading || !!todayRecord || holidayInfo.isHoliday}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-2xl transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
              >
                <LogIn size={20} /> 
                {holidayInfo.isHoliday ? "Holiday Today" : todayRecord ? "Punched In" : "Punch In"}
              </button>

              <button 
                onClick={() => handleAction('out')}
                disabled={loading || !todayRecord || !!todayRecord?.punchOut || holidayInfo.isHoliday}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-500/50 text-red-500 hover:bg-red-500/10 font-bold py-4 rounded-2xl transition-all disabled:opacity-10"
              >
                <LogOut size={20} /> {todayRecord?.punchOut ? "Done for Day" : "Punch Out"}
              </button>
            </div>
          </div>

          {/* Today's Summary Card */}
          <div className="bg-[#111827]/50 border border-gray-800 p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Today's Log</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-500 text-sm font-bold uppercase">In</span>
                <span className="text-teal-400 font-black">{todayRecord?.punchIn || '--:--'}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                <span className="text-gray-500 text-sm font-bold uppercase">Out</span>
                <span className="text-red-400 font-black">{todayRecord?.punchOut || '--:--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Calendar Section */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">
               {new Date().toLocaleString('default', { month: 'long' })} <span className="text-teal-500">{new Date().getFullYear()}</span>
            </h3>
            <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2 text-teal-400 bg-teal-500/5 px-3 py-1.5 rounded-full border border-teal-500/20">Present</div>
               <div className="flex items-center gap-2 text-red-500 bg-red-500/5 px-3 py-1.5 rounded-full border border-red-500/20">Holiday</div>
               <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/5 px-3 py-1.5 rounded-full border border-yellow-500/20">Late</div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-[11px] font-black text-gray-600 tracking-[0.2em]">{day}</div>
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const statusClass = getDayStatus(day);
              return (
                <div key={i} className={`aspect-square flex flex-col items-center justify-center border-2 rounded-2xl text-base font-black transition-all hover:scale-110 cursor-default group relative ${statusClass}`}>
                  {day}
                  {statusClass.includes("red-500") && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center gap-3">
             <Info className="text-teal-500 w-5 h-5" />
             <p className="text-xs text-gray-500 font-medium">Attendance on Holidays is auto-marked by the system. No action required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;