import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaHeart, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const ManageBlogs = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await blogsAPI.getAllAdmin();
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error('Fetch blogs error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await blogsAPI.delete(id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await blogsAPI.togglePublish(id);
      toast.success('Publish status updated');
      fetchBlogs();
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
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Blogs</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Create, edit, and manage your blog posts</p>
        </div>
        {isSuperAdmin && (
          <Link to="/admin/blogs/add" className="btn-primary text-sm sm:text-base">
            <FaPlus className="mr-2" /> Write New Post
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Write your first blog post to get started!</p>
          {isSuperAdmin && (
            <Link to="/admin/blogs/add" className="btn-primary inline-flex">
              <FaPlus className="mr-2" /> Write New Post
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Published / Draft</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Stats</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <img src={getImageUrl(blog.featuredImage)} alt={blog.title} className="w-10 h-10 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    <div className="text-sm font-medium">{blog.title}</div>
                    <div className="text-xs text-slate-500">{blog.readingTime} min read</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">{blog.category}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell text-sm text-slate-500">
                    {blog.isPublished ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Published</span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">Draft</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FaEye /> {blog.views}</span>
                      <span className="flex items-center gap-1"><FaHeart /> {blog.likes}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleTogglePublish(blog._id)}
                        className={`p-2 rounded-lg transition ${blog.isPublished ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
                        title={blog.isPublished ? 'Unpublish (move to Draft)' : 'Publish'}
                      >
                        {blog.isPublished ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">{blog.isPublished ? 'Published' : 'Draft'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isSuperAdmin && (
                      <div className="flex gap-2">
                        <Link to={`/admin/blogs/edit/${blog._id}`} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition" title="Edit">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleDelete(blog._id, blog.title)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Delete">
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

export default ManageBlogs;