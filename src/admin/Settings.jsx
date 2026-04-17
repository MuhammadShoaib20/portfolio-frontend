import { useAuth } from '../context/AuthContext';
import ChangePassword from './ChangePassword';

const Settings = () => {
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';

  if (isViewer) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Manage your account settings and security</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">Viewer accounts cannot change settings. Contact superadmin for assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Manage your account settings and security</p>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6">
        <ChangePassword />
      </div>
    </div>
  );
};

export default Settings;