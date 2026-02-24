import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-16 bg-black border-b border-gray-900 flex items-center justify-between px-4 md:px-8 fixed top-0 right-0 left-0 md:left-64 z-20">
      {/* Left: mobile hamburger + optional breadcrumbs */}
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden mr-3 p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-white font-medium hidden md:block">{/* Breadcrumbs placeholder */}</div>
      </div>

      {/* Right: user + logout (compact on small screens) */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <div className="flex items-center text-white min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mr-3 flex-shrink-0">
            <UserIcon className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate max-w-[90px] sm:max-w-[150px]">{user?.name || 'Admin'}</span>
            <span className="text-xs text-red-500 tracking-wider uppercase hidden sm:block">{user?.role || 'Staff'}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-0 sm:mr-2" />
          <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Topbar;