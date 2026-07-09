import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react';

const EmployeeHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data } = await API.get('/holidays/all');
        setHolidays(data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // FIX: Timezone-safe comparison function
  const getDayStatus = (day) => {
    // Calendar ki date (Local format)
    const calendarDate = new Date(currentYear, currentMonth, day);
    const dateKey = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(calendarDate.getDate()).padStart(2, '0')}`;
    
    // Database dates ko bhi same format mein convert karke dhundho
    const isHoliday = holidays.find(h => {
      const hDate = new Date(h.date);
      const hKey = `${hDate.getFullYear()}-${String(hDate.getMonth() + 1).padStart(2, '0')}-${String(hDate.getDate()).padStart(2, '0')}`;
      return hKey === dateKey;
    });
    
    if (isHoliday) {
      return "bg-red-500/20 border-red-500 text-red-500 font-black shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    }
    return "border-gray-800/50 text-gray-500 hover:border-gray-700";
  };

  if (loading) return <div className="p-8 text-white">Loading Holidays...</div>;

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Holiday <span className="text-teal-400">Calendar</span></h2>
          <p className="text-gray-500 mt-1 font-medium italic">Explore official holidays for the entire year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CALENDAR SECTION */}
        <div className="lg:col-span-2 bg-[#111827] border border-gray-800 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
               <span className="text-teal-500">{viewDate.toLocaleString('default', { month: 'long' })}</span> {currentYear}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 bg-gray-800 hover:bg-teal-500 hover:text-black rounded-xl transition-all">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 bg-gray-800 hover:bg-teal-500 hover:text-black rounded-xl transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-center text-[11px] font-black text-gray-600 tracking-[0.2em]">{day}</div>
            ))}
            
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const statusClass = getDayStatus(day);
              return (
                <div key={i} className={`aspect-square flex flex-col items-center justify-center border-2 rounded-2xl text-base font-black transition-all group relative ${statusClass}`}>
                  {day}
                  {statusClass.includes("red-500") && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE: LIST & SUMMARY */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 p-6 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-4 text-teal-400">
              <PartyPopper size={20} />
              <h4 className="font-black uppercase tracking-widest text-xs">Next Upcoming</h4>
            </div>
            {holidays.filter(h => new Date(h.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))[0] ? (
              <div>
                <h2 className="text-2xl font-black text-white">{holidays.filter(h => new Date(h.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))[0].name}</h2>
                <p className="text-teal-500 font-bold mt-1 uppercase text-[10px]">
                  {new Date(holidays.filter(h => new Date(h.date) >= new Date()).sort((a,b) => new Date(a.date) - new Date(b.date))[0].date).toLocaleDateString([], { day: 'numeric', month: 'long', weekday: 'long' })}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 font-bold italic">No holidays scheduled</p>
            )}
          </div>

          <div className="bg-[#111827] border border-gray-800 p-6 rounded-[2rem] h-[350px] overflow-y-auto custom-scrollbar">
            <h4 className="text-[10px] font-black text-gray-500 uppercase mb-6 tracking-[0.2em]">Yearly Holiday List</h4>
            <div className="space-y-4">
              {holidays.sort((a,b) => new Date(a.date) - new Date(b.date)).map((h, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-800/50 pb-3">
                  <div>
                    <p className="font-bold text-sm text-white">{h.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">{new Date(h.date).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${h.type === 'National' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-500'}`}>{h.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHoliday;