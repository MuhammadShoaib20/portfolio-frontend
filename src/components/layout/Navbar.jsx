import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes, FaMoon, FaSun, FaSignInAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/skills', label: 'Skills' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/30 shadow-sm overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-primary tracking-tight flex-shrink-0"
        >
          MyPortfolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive
                    ? 'text-primary'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition flex-shrink-0"
            aria-label="Toggle theme"
          >
            {theme === 'light'
              ? <FaMoon size={16} />
              : <FaSun size={16} className="text-yellow-400" />
            }
          </button>

          {/* Auth Links */}
          {!user ? (
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition"
            >
              <FaSignInAlt size={14} /> Login
            </Link>
          ) : (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition"
            >
              <FaTachometerAlt size={14} /> Dashboard
            </Link>
          )}
        </div>

        {/* Mobile right side — theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {theme === 'light'
              ? <FaMoon size={16} />
              : <FaSun size={16} className="text-yellow-400" />
            }
          </button>
          <button
            className="p-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="w-full px-4 py-3 flex flex-col">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-2 py-3 text-sm font-medium border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors hover:text-primary ${
                    isActive
                      ? 'text-primary'
                      : 'text-slate-600 dark:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Mobile auth links */}
            {!user ? (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg bg-primary text-white text-sm font-medium justify-center"
              >
                <FaSignInAlt size={14} /> Login
              </Link>
            ) : (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg bg-primary/10 text-primary text-sm font-medium justify-center"
              >
                <FaTachometerAlt size={14} /> Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;