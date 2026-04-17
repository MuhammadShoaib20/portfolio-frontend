import { useTheme } from '../../context/ThemeContext';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';

const AdminNavbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          aria-label="Toggle menu"
        >
          <FaBars className="text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1" /> {/* Spacer */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun className="text-yellow-400" />}
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;