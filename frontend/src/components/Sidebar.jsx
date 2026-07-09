import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, Briefcase, 
  CalendarClock, TreePalm, Calculator, BarChart3, 
  Settings2, LogOut, FileText, Landmark, ClipboardList,
  Clock3, Umbrella, Globe, ChevronDown, ChevronRight,
  LifeBuoy, ShieldCheck, UserCircle, History, Download,
  PieChart 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const role = user?.role;

  const [openGroups, setOpenGroups] = useState({
    'MAIN': true,
    'EMPLOYEE MANAGEMENT': true,
    'ATTENDANCE': true, 
    'LEAVES': true,
    'PAYROLL': false,
    'REPORTS': true,
    'SYSTEM': false,
    'OVERVIEW': true,
    'MY ATTENDANCE': true, 
    'MY PAYROLL': true, // Isse true kiya taaki payslip dikhe
    'MY LEAVES': true,
    'MY PROFILE': false,
    'SUPPORT': false
  });

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const adminMenu = [
    { group: 'MAIN', isCollapsible: false, items: [{ title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={22} /> }] },
    { group: 'EMPLOYEE MANAGEMENT', isCollapsible: true, items: [
      { title: 'Employees', path: '/employees', icon: <Users size={20} /> },
      { title: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
      { title: 'Designations', path: '/designations', icon: <Briefcase size={20} /> },
      { title: 'Update Requests', path: '/update-requests', icon: <ClipboardList size={20} /> },
    ]},
    { group: 'ATTENDANCE', isCollapsible: true, items: [
      { title: 'Attendance Monitor', path: '/attendance-monitor', icon: <CalendarClock size={20} /> },
      { title: 'Holidays', path: '/admin/holidays', icon: <Globe size={20} /> }, 
      { title: 'Shifts', path: '/shifts', icon: <Clock3 size={20} /> },
    ]},
    { group: 'LEAVES', isCollapsible: true, items: [
      { title: 'Leave Requests', path: '/leave-requests', icon: <ClipboardList size={20} /> },
      { title: 'Leave Policies', path: '/leave-policies', icon: <Umbrella size={20} /> },
    ]},
    { group: 'PAYROLL', isCollapsible: true, items: [
      { title: 'Generate Payroll', path: '/payroll', icon: <Calculator size={20} /> },
      { title: 'Salary Structure', path: '/salary-structure', icon: <Landmark size={20} /> },
      { title: 'Payslips', path: '/payslips', icon: <FileText size={20} /> },
    ]},
    { group: 'REPORTS', isCollapsible: true, items: [
      { title: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
      { title: 'Holiday Analytics', path: '/admin/holiday-report', icon: <PieChart size={20} /> },
      { title: 'Exports', path: '/exports', icon: <Download size={20} /> },
    ]},
    { group: 'SYSTEM', isCollapsible: true, items: [
      { title: 'Settings', path: '/settings', icon: <Settings2 size={20} /> },
    ]}
  ];

  const employeeMenu = [
    { group: 'OVERVIEW', isCollapsible: true, items: [
      { title: 'My Dashboard', path: '/employee-profile', icon: <LayoutDashboard size={22} /> },
      { title: 'Today Status', path: '/status', icon: <ShieldCheck size={20} /> },
      { title: 'Upcoming Holiday', path: '/holidays', icon: <Globe size={20} /> }
    ]},
    { group: 'MY ATTENDANCE', isCollapsible: true, items: [
      { title: 'Mark Attendance', path: '/attendance', icon: <CalendarClock size={20} /> },
      { title: 'Attendance History', path: '/history', icon: <History size={20} /> }
    ]},
    { group: 'MY PAYROLL', isCollapsible: true, items: [
      // --- YAHAN PATH CHANGE KIYA HAI ---
      { title: 'My Payslips', path: '/my-payslips', icon: <FileText size={20} /> }, 
      { title: 'Salary Breakdown', path: '/salary-info', icon: <Calculator size={20} /> }
    ]},
    { group: 'MY LEAVES', isCollapsible: true, items: [
      { title: 'Apply Leave', path: '/apply-leave', icon: <TreePalm size={20} /> },
      { title: 'Leave History', path: '/leave-history', icon: <History size={20} /> },
      { title: 'Leave Balance', path: '/leave-balance', icon: <Umbrella size={20} /> }
    ]},
    { group: 'MY PROFILE', isCollapsible: true, items: [
      { title: 'My Profile', path: '/profile-settings', icon: <UserCircle size={20} /> },
      { title: 'Documents', path: '/documents', icon: <FileText size={20} /> }
    ]},
    { group: 'SUPPORT', isCollapsible: true, items: [
      { title: 'Raise Ticket', path: '/support', icon: <LifeBuoy size={20} /> },
      { title: 'Company Policies', path: '/policies', icon: <ShieldCheck size={20} /> }
    ]}
  ];

  const currentMenu = role === 'Admin' ? adminMenu : employeeMenu;

  return (
    <div className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-black text-teal-400 tracking-tighter text-center uppercase">PAYLYNX</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto custom-scrollbar">
        {currentMenu.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <button 
              type="button"
              onClick={() => group.isCollapsible && toggleGroup(group.group)}
              className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-300 transition-colors"
            >
              <span>{group.group}</span>
              {group.isCollapsible && (
                openGroups[group.group] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
            </button>

            {(!group.isCollapsible || openGroups[group.group]) && (
              <div className="space-y-1.5 ml-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base ${
                      location.pathname === item.path
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-lg'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          className="flex items-center gap-4 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-base font-bold"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;