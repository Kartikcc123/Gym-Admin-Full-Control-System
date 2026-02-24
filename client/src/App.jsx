import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Auth/Login'; // Assuming you moved Login.jsx to pages/Auth/
import Dashboard from './pages/Dashboard/Dashboard'; 
import MemberList from './pages/Members/MemberList';
import MemberDetail from './pages/Members/MemberDetail';
import Plans from './pages/Plans/Plans'; 
import Payments from './pages/Payments/Payments';
import Attendance from './pages/Attendance/QRScanner'; 
import Trainers from './pages/Trainers/Trainers';
import Routines from './pages/Routines/Routines';

const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="p-10 text-red-500 font-black uppercase tracking-widest border border-red-900 rounded-xl bg-[#0a0a0a]">
      Access Denied
    </div>
  </div>
);

function App() {
  // FIXED 1: Moved inside the component so React checks it every time the app re-renders!
  const userInfo = localStorage.getItem('userInfo');

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <Routes>
        {/* Public Routes */}
        {/* If they are already logged in and try to go to /login, instantly kick them to the dashboard */}
        <Route 
          path="/login" 
          element={userInfo ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          
          {/* Main Layout Wrapper (Sidebar + Topbar) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/trainers" element={<Trainers />} />

            <Route path="/routines" element={<Routines />} />
          </Route>

        </Route>

        {/* FIXED 2: The Catch-All Fallback */}
        {/* If they type a random URL, send them to Dashboard if logged in, or Login if they aren't */}
        <Route path="*" element={<Navigate to={userInfo ? "/dashboard" : "/login"} replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;