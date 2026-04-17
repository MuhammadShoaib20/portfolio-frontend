import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';
import { FaCalendar, FaClock, FaHeart, FaArrowLeft, FaUser, FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import DOMPurify from 'dompurify'; // optional but recommended

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogsAPI.getBySlug(slug);
      setBlog(res.data);
    } catch (error) {
      toast.error('Blog not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
    window.scrollTo(0, 0);
  }, [fetchBlog]);

  const handleLike = async () => {
    try {
      await blogsAPI.like(blog._id);
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      toast.success('Thanks for liking!');
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const formattedDate = () => {
    if (!blog?.publishedAt) return 'No date';
    const date = new Date(blog.publishedAt);
    return isValid(date) ? format(date, 'MMMM dd, yyyy') : 'Invalid date';
  };

  // Sanitize HTML content to prevent XSS
  const sanitizedContent = () => {
    if (!blog?.content) return '';
    return DOMPurify.sanitize(blog.content);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Blog Post Not Found</h2>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <FaArrowLeft /> Back to Blog
        </Link>

        <article className="space-y-8">
          <header className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-500 mb-4">
              <span className="flex items-center gap-1"><FaUser /> {blog.author?.name || 'Admin'}</span>
              <span className="flex items-center gap-1"><FaCalendar /> {formattedDate()}</span>
              <span className="flex items-center gap-1"><FaClock /> {blog.readingTime} min read</span>
            </div>
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {blog.featuredImage && (
            <figure className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={blog.featuredImage} alt={blog.title} className="w-full h-auto" />
            </figure>
          )}

          {/* Content with HTML rendering */}
          <div
            className="prose dark:prose-invert max-w-none card p-6 sm:p-8"
            dangerouslySetInnerHTML={{ __html: sanitizedContent() }}
          />

          <footer className="flex flex-wrap items-center justify-between gap-4 card p-6">
            <button onClick={handleLike} className="btn-outline flex items-center gap-2">
              <FaHeart /> {blog.likes || 0} Likes
            </button>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">{blog.category}</span>
          </footer>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Share this post</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div className="text-center">
            <Link to="/blog" className="btn-primary inline-flex">
              ← Back to All Posts
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;