import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSave, FaTimes } from 'react-icons/fa';
import ImageUploader from '../components/common/ImageUploader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles

const AddBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle Quill content change
  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      await blogsAPI.create({ ...formData, tags: tagsArray });
      toast.success('Blog post created successfully!');
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  // Quill toolbar configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Write New Blog Post</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Create a new blog article</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Blog Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt * (Max 300 chars)</label>
          <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" maxLength="300" required disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.excerpt.length}/300</p>
        </div>

        {/* Content - Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Blog Content *</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            modules={modules}
            className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
            style={{ height: '400px', marginBottom: '50px' }}
            readOnly={loading}
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} disabled={loading}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image</label>
          <ImageUploader currentImage={formData.featuredImage} onImageUpload={(url) => setFormData({ ...formData, featuredImage: url })} />
          <p className="text-xs text-slate-500 mt-2">Or paste URL manually:</p>
          <input type="url" name="featuredImage" value={formData.featuredImage} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={loading}
            className="w-full mt-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description (SEO) (Max 160 chars)</label>
          <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows="2" maxLength="160" disabled={loading}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <p className="text-xs text-right text-slate-500 mt-1">{formData.metaDescription.length}/160</p>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} disabled={loading}
              className="w-4 h-4 text-primary rounded border-slate-300 dark:border-slate-600 focus:ring-primary"
            />
            <span className="text-sm">Publish Immediately</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} disabled={loading}
              className="w-4 h-4 text-primary rounded border-slate-300 dark:border-slate-600 focus:ring-primary"
            />
            <span className="text-sm">Mark as Featured Post</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Creating...' : <><FaSave className="mr-2" /> {formData.isPublished ? 'Publish Post' : 'Save as Draft'}</>}
          </button>
          <button type="button" onClick={() => navigate('/admin/blogs')} className="btn-outline flex-1" disabled={loading}>
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;