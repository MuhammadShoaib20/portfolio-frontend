import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaStar, FaEye, FaHeart } from 'react-icons/fa';

const ManageProjects = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getAll();
      setProjects(res.data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await projectsAPI.toggleFeatured(id);
      toast.success('Featured status updated');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const getImageUrl = (url) => (url?.trim() ? url : 'https://placehold.co/600x400?text=No+Image');

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
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Projects</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Create, edit, and manage your portfolio projects</p>
        </div>
        {isSuperAdmin && (
          <Link to="/admin/projects/add" className="btn-primary text-sm sm:text-base">
            <FaPlus className="mr-2" /> Add New Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Create your first project to get started!</p>
          {isSuperAdmin && (
            <Link to="/admin/projects/add" className="btn-primary inline-flex">
              <FaPlus className="mr-2" /> Add New Project
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Technologies</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Stats</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Featured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <img src={getImageUrl(project.image)} alt={project.title} className="w-10 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{project.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{project.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs">{tech}</span>
                      ))}
                      {project.technologies.length > 2 && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs">+{project.technologies.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FaEye /> {project.views}</span>
                      <span className="flex items-center gap-1"><FaHeart /> {project.likes}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleToggleFeatured(project._id)}
                        className={`p-2 rounded-lg transition ${project.featured ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                        title={project.featured ? 'Remove featured' : 'Mark featured'}
                      >
                        <FaStar />
                      </button>
                    ) : (
                      <span className="text-slate-500">{project.featured ? '★ Featured' : ''}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSuperAdmin && (
                      <div className="flex gap-2">
                        <Link to={`/admin/projects/edit/${project._id}`} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition" title="Edit">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleDelete(project._id, project.title)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;