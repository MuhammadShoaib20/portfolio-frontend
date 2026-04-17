import { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaUserPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAll();
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCreateViewer = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Role is fixed to 'viewer' on the backend
      await userAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'viewer',
      });
      toast.success('Viewer account created successfully');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await userAPI.delete(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const getRoleBadgeClass = (role) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    if (role === 'superadmin') return `${base} bg-purple-500/20 text-purple-600 dark:text-purple-400`;
    return `${base} bg-blue-500/20 text-blue-600 dark:text-blue-400`; // viewer
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FaUserPlus className="mr-2" /> Create Viewer Account
        </button>
      </div>

      <div className="overflow-x-auto backdrop-blur-md bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30 rounded-2xl">
        <table className="w-full">
          <thead className="border-b border-white/20 dark:border-slate-700/30">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20 dark:divide-slate-700/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500 dark:text-slate-500">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-white/10 dark:hover:bg-slate-700/10">
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u._id !== user?._id && (
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        title="Delete user"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create Viewer */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="max-w-md w-full backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/30 rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Create Viewer Account</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleCreateViewer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border ${
                    formErrors.name ? 'border-red-500' : 'border-white/20 dark:border-slate-600/30'
                  } text-slate-900 dark:text-white focus:outline-none focus:border-primary`}
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border ${
                    formErrors.email ? 'border-red-500' : 'border-white/20 dark:border-slate-600/30'
                  } text-slate-900 dark:text-white focus:outline-none focus:border-primary`}
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border ${
                    formErrors.password ? 'border-red-500' : 'border-white/20 dark:border-slate-600/30'
                  } text-slate-900 dark:text-white focus:outline-none focus:border-primary`}
                />
                {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-white/20 dark:border-slate-600/30'
                  } text-slate-900 dark:text-white focus:outline-none focus:border-primary`}
                />
                {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{formErrors.confirmPassword}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Create Viewer</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;