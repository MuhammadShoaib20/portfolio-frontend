import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import ImageUploader from '../components/common/ImageUploader';

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    image: '',
    technologies: '',
    category: 'Web Development',
    liveUrl: '',
    githubUrl: '',
    status: 'Completed',
    featured: false,
  });

  const categories = ['Web Development', 'Mobile App', 'Desktop App', 'UI/UX Design', 'Full Stack', 'Frontend', 'Backend', 'Game Development', 'AI/ML', 'Other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.fullDescription) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const technologiesArray = formData.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      await projectsAPI.create({ ...formData, technologies: technologiesArray });
      toast.success('Project created successfully!');
      navigate('/admin/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Add New Project</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Create a new portfolio project</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Short Description * (Max 200 chars)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" maxLength="200" required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.description.length}/200</p>
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Description *</label>
          <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows="6" required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium mb-1">Technologies * (comma-separated)</label>
          <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB" required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <p className="text-xs text-slate-500 mt-1">Separate each technology with a comma</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Image</label>
          <ImageUploader currentImage={formData.image} onImageUpload={(url) => setFormData({ ...formData, image: url })} />
          <p className="text-xs text-slate-500 mt-2">Or paste URL manually:</p>
          <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={loading}
            className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Live & GitHub URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Live Demo URL (Optional)</label>
            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myproject.com" disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL (Optional)</label>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username/repo" disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Featured Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} disabled={loading}
            className="w-4 h-4 text-primary rounded border-slate-300 dark:border-slate-600 focus:ring-primary"
          />
          <span className="text-sm">Mark as Featured Project</span>
        </label>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Creating...' : <><FaSave className="mr-2" /> Create Project</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-outline flex-1" disabled={loading}>
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;