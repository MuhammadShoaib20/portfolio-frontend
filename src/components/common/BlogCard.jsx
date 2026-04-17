import { Link } from 'react-router-dom';
import { FaCalendar, FaClock, FaEye, FaHeart, FaArrowRight } from 'react-icons/fa';
import { format, isValid } from 'date-fns';

const BlogCard = ({ blog }) => {
  const imageUrl = blog.featuredImage?.trim() || 'https://placehold.co/600x400?text=No+Image';

  const formattedDate = () => {
    if (!blog.publishedAt) return 'No date';
    const date = new Date(blog.publishedAt);
    return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
  };

  return (
    <article className="group card overflow-hidden hover:-translate-y-2 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-xs font-medium text-primary">
          {blog.category}
        </span>
        {blog.featured && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
            Featured
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 mb-3">
          <span className="flex items-center gap-1"><FaCalendar /> {formattedDate()}</span>
          <span className="flex items-center gap-1"><FaClock /> {blog.readingTime} min read</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{blog.excerpt}</p>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs px-3 py-1 rounded-full bg-white/30 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-slate-700 dark:text-slate-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-700/30">
          <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-500">
            <span className="flex items-center gap-1"><FaEye /> {blog.views || 0}</span>
            <span className="flex items-center gap-1"><FaHeart /> {blog.likes || 0}</span>
          </div>
          <Link to={`/blog/${blog.slug}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            Read More <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;