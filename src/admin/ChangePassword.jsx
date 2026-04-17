import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const toggleShow = (field) => {
    setShow(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const checkStrength = (password) => {
    if (password.length < 8) return 'weak';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) return 'strong';
    if (password.match(/^(?=.*[a-z])(?=.*\d)/)) return 'medium';
    return 'weak';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') setPasswordStrength(checkStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toast.success('Password updated successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" value={user?.email || ''} readOnly className="hidden" autoComplete="username" />

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
          <div className="relative">
            <input
              type={show.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            >
              {show.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
          <div className="relative">
            <input
              type={show.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            >
              {show.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formData.newPassword && (
            <div className={`text-xs mt-1 ${
              passwordStrength === 'weak' ? 'text-red-500' :
              passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
            }`}>
              Strength: {passwordStrength}
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
            />
            <button
              type="button"
              onClick={() => toggleShow('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
            >
              {show.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;