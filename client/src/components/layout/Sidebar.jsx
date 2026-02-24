import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, QrCode, CreditCard, ClipboardList, Dumbbell } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: QrCode },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Plans', path: '/plans', icon: ClipboardList },
    { name: 'Routines', path: '/routines', icon: Dumbbell },
    { name: 'Trainers', path: '/trainers', icon: Dumbbell },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-black border-r border-gray-900 transition-transform duration-200 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-900">
        <Dumbbell className="text-red-600 w-6 h-6 mr-3" />
        <span className="text-xl font-black text-white tracking-widest uppercase">NextGenz</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path}>
            {({ isActive }) => (
              <div
                onClick={() => { if (onClose) onClose(); }}
                className={`flex items-center px-4 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? 'text-white border-l-4 border-red-600 bg-red-900/10 rounded-r-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900 border-l-4 border-transparent rounded-lg'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-red-500' : 'text-gray-500'}`} />
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;