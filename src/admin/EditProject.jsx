import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import ImageUploader from '../components/common/ImageUploader';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  const categories = [
    'Web Development', 'Mobile App', 'Desktop App', 'UI/UX Design',
    'Full Stack', 'Frontend', 'Backend', 'Game Development', 'AI/ML', 'Other',
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setFetching(true);
        const res = await projectsAPI.getById(id);
        const project = res.data.project;
        setFormData({
          title: project.title,
          description: project.description,
          fullDescription: project.fullDescription,
          image: project.image || '',
          technologies: project.technologies.join(', '),
          category: project.category,
          liveUrl: project.liveUrl || '',
          githubUrl: project.githubUrl || '',
          status: project.status,
          featured: project.featured,
        });
      } catch (error) {
        toast.error('Failed to fetch project');
        navigate('/admin/projects');
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const techArray = formData.technologies.split(',').map(t => t.trim()).filter(Boolean);
      await projectsAPI.update(id, { ...formData, technologies: techArray });
      toast.success('Project updated successfully!');
      navigate('/admin/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Project</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Update project details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl p-4 sm:p-6 space-y-4">
        {/* Same fields as AddProject, with prefilled values */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short Description * (Max 200 chars)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" maxLength="200" required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.description.length}/200</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Description *</label>
          <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows="6" required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            >
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Planned">Planned</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Technologies * (comma-separated)</label>
          <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB" required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-slate-500 mt-1">Separate each technology with a comma</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project Image</label>
          <ImageUploader currentImage={formData.image} onImageUpload={(url) => setFormData({ ...formData, image: url })} />
          <p className="text-xs text-slate-500 mt-2">Or paste URL manually:</p>
          <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Live Demo URL (Optional)</label>
            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myproject.com" disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub URL (Optional)</label>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username/repo" disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} disabled={loading}
            className="w-4 h-4 text-primary rounded border-white/30 bg-white/30 focus:ring-primary"
          />
          <span className="text-sm">Mark as Featured Project</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/20 dark:border-slate-700/30">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Updating...' : <><FaSave className="mr-2" /> Update Project</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-outline flex-1" disabled={loading}>
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;