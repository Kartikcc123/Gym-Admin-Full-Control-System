import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token: storeToken, user: storeUser } = useAuthStore();

  // Prefer store token, but fall back to `userInfo` in localStorage (keeps Login.jsx + axios consistent)
  let token = storeToken;
  let user = storeUser;

  if (!token) {
    try {
      const raw = localStorage.getItem('userInfo');
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed.token;
        user = user || { _id: parsed._id, name: parsed.name, email: parsed.email, role: parsed.role };
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  // 1. Check if the user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role-Based Access Control (Optional but great for NextGenzSolutions' ERP)
  // If specific roles are required (e.g., Admin only) and the user doesn't match, block them.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If authenticated and authorized, render the requested page
  return <Outlet />;
};

export default ProtectedRoute;