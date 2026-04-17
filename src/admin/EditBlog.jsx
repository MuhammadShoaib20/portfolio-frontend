import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import ImageUploader from '../components/common/ImageUploader';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Web Development',
    tags: '',
    isPublished: false,
    featured: false,
    metaDescription: '',
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Programming',
    'Tutorial',
    'Tech News',
    'Career',
    'Productivity',
    'Design',
    'DevOps',
    'AI/ML',
    'Other',
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setFetching(true);
        const response = await blogsAPI.getAll();
        const blog = response.data.blogs.find((b) => b._id === id);
        if (!blog) {
          toast.error('Blog not found');
          navigate('/admin/blogs');
          return;
        }
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          featuredImage: blog.featuredImage || '',
          category: blog.category,
          tags: blog.tags.join(', '),
          isPublished: blog.isPublished,
          featured: blog.featured,
          metaDescription: blog.metaDescription || '',
        });
      } catch (error) {
        toast.error('Failed to fetch blog');
        navigate('/admin/blogs');
      } finally {
        setFetching(false);
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const blogData = { ...formData, tags: tagsArray };
      await blogsAPI.update(id, blogData);
      toast.success('Blog post updated successfully!');
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog post');
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
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Update blog post details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl p-4 sm:p-6 space-y-4">
        {/* Same fields as AddBlog, with prefilled values */}
        <div>
          <label className="block text-sm font-medium mb-1">Blog Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt * (Max 300 chars)</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" maxLength="300" required disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.excerpt.length}/300</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Blog Content *</label>
          <textarea name="content" value={formData.content} onChange={handleChange} rows="15" required disabled={loading}
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
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Featured Image</label>
          <ImageUploader currentImage={formData.featuredImage} onImageUpload={(url) => setFormData({ ...formData, featuredImage: url })} />
          <p className="text-xs text-slate-500 mt-2">Or paste URL manually:</p>
          <input type="url" name="featuredImage" value={formData.featuredImage} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={loading}
            className="w-full mt-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Description (SEO) (Max 160 chars)</label>
          <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="2" maxLength="160" disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/30 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.metaDescription.length}/160</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} disabled={loading}
              className="w-4 h-4 text-primary rounded border-white/30 bg-white/30 focus:ring-primary"
            />
            <span className="text-sm">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} disabled={loading}
              className="w-4 h-4 text-primary rounded border-white/30 bg-white/30 focus:ring-primary"
            />
            <span className="text-sm">Featured Post</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/20 dark:border-slate-700/30">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Updating...' : <><FaSave className="mr-2" /> Update Post</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/blogs')} className="btn-outline flex-1" disabled={loading}>
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;