import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import AddEmployee from './pages/AddEmployee';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmployeeProfile from './pages/EmployeeProfile';
import AttendanceMonitor from './pages/AttendanceMonitor';
import Departments from './pages/Departments';
import Designations from './pages/Designations';
import EditEmployee from './pages/EditEmployee';
import AdminHoliday from './pages/AdminHoliday';
import EmployeeHoliday from './pages/EmployeeHoliday';
import HolidayReport from './pages/HolidayReport';
import Shifts from './pages/Shifts';
import LeavePolicies from './pages/LeavePolicies';
import LeaveRequests from './pages/LeaveRequests';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import LeaveBalance from './pages/LeaveBalance';
import ProfileSettings from './pages/ProfileSettings';
import UpdateRequests from './pages/UpdateRequests';

// --- NAYA IMPORT YAHAN HAI ---
import MyPayslips from './pages/MyPayslips'; 

const Layout = ({ children }) => {
  const location = useLocation();
  const noSidebarRoutes = ['/', '/signup', '/forgot-password'];
  const hideSidebar = noSidebarRoutes.includes(location.pathname) || location.pathname.startsWith('/reset-password');

  return (
    <div className="flex min-h-screen bg-[#0a0f1a] text-white">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Specific Routes */}
          <Route path="/attendance-monitor" element={<AttendanceMonitor />} />
          <Route path="/admin/holidays" element={<AdminHoliday />} />
          <Route path="/admin/holiday-report" element={<HolidayReport />} />
          <Route path="/leave-policies" element={<LeavePolicies />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          
          {/* Employee Specific Routes */}
          <Route path="/holidays" element={<EmployeeHoliday />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-history" element={<LeaveHistory />} />
          <Route path="/leave-balance" element={<LeaveBalance />} />
          {/* --- NAYA ROUTE YAHAN HAI --- */}
          <Route path="/my-payslips" element={<ProtectedRoute><MyPayslips /></ProtectedRoute>} />

          {/* Protected General Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
          <Route path="/shifts" element={<ProtectedRoute><Shifts /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
          <Route path="/designations" element={<ProtectedRoute><Designations /></ProtectedRoute>} />
          <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
          <Route path="/edit-employee/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          <Route path="/employee-profile" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/update-requests" element={<ProtectedRoute><UpdateRequests /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;