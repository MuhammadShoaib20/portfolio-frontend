import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminNavbar onMenuClick={toggleSidebar} />
      <div className="flex">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
            sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="absolute inset-0 bg-black/50" onClick={closeSidebar} />
          <div
            className={`absolute left-0 top-0 h-full w-64 transform transition-transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <AdminSidebar onClose={closeSidebar} />
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;