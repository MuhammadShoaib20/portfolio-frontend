import { useState, useEffect, useCallback } from 'react';
import { blogsAPI } from '../utils/api';
import BlogCard from '../components/common/BlogCard';
import toast from 'react-hot-toast';

const categories = ['all', 'Web Development', 'Tutorial', 'Programming', 'Tech News', 'Career'];

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { category: filter } : {};
      const res = await blogsAPI.getAll(params);
      setBlogs(res.data.blogs);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Articles</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Thoughts, tutorials, and insights about web development</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 animate-pulse"></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-500">
            <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
            <p>Check back later for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;