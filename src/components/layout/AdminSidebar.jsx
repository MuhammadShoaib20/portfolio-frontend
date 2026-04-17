import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaProjectDiagram,
  FaBlog,
  FaEnvelope,
  FaUser,
  FaCog,
  FaUserCog,
  FaSignOutAlt,
  FaFilePdf,
} from 'react-icons/fa';

const AdminSidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome, allowed: true },
    { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram, allowed: true },
    { path: '/admin/blogs', label: 'Blogs', icon: FaBlog, allowed: true },
    { path: '/admin/messages', label: 'Messages', icon: FaEnvelope, allowed: true },
    { path: '/admin/profile', label: 'Profile', icon: FaUser, allowed: true },
    { path: '/admin/settings', label: 'Settings', icon: FaCog, allowed: isSuperAdmin },
    { path: '/admin/resumes', label: 'Resumes', icon: FaFilePdf, allowed: true },
    { path: '/admin/users', label: 'Admin Management', icon: FaUserCog, allowed: isSuperAdmin },
  ];

  const filteredNav = navItems.filter(item => item.allowed);

  return (
    <aside className="h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-primary">MyPortfolio</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`
            }
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;