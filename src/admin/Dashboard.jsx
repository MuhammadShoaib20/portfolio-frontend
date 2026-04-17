import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, blogsAPI, contactAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaProjectDiagram, FaBlog, FaEnvelope, FaEye, FaHeart, FaPlus, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [stats, setStats] = useState({ totalProjects: 0, totalBlogs: 0, totalMessages: 0, unreadMessages: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogsRes, messagesRes] = await Promise.all([
          projectsAPI.getAll(),
          blogsAPI.getAll(),
          contactAPI.getAll(),
        ]);
        const projects = projectsRes.data.projects;
        const blogs = blogsRes.data.blogs;
        const messages = messagesRes.data.messages;
        setStats({
          totalProjects: projects.length,
          totalBlogs: blogs.length,
          totalMessages: messages.length,
          unreadMessages: messages.filter((m) => m.status === 'unread').length,
        });
        setRecentProjects(projects.slice(0, 5));
        setRecentBlogs(blogs.slice(0, 5));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Welcome back, {user?.name || 'Admin'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={FaProjectDiagram} label="Projects" value={stats.totalProjects} color="blue" />
        <StatCard icon={FaBlog} label="Blog Posts" value={stats.totalBlogs} color="purple" />
        <StatCard
          icon={FaEnvelope}
          label="Messages"
          value={stats.totalMessages}
          badge={stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null}
          color="green"
        />
      </div>

      {/* Quick Actions - only for superadmin */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/projects/add" className="btn-primary text-sm sm:text-base">
              <FaPlus className="mr-2" /> New Project
            </Link>
            <Link to="/admin/blogs/add" className="btn-primary text-sm sm:text-base">
              <FaPlus className="mr-2" /> New Blog
            </Link>
            <Link to="/admin/messages" className="btn-primary text-sm sm:text-base">
              <FaEnvelope className="mr-2" /> Messages
            </Link>
            <Link to="/admin/profile" className="btn-primary text-sm sm:text-base">
              <FaUser className="mr-2" /> Edit Profile
            </Link>
          </div>
        </div>
      )}

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSection
          title="Recent Projects"
          viewAllLink="/admin/projects"
          items={recentProjects}
          renderItem={(item) => (
            <>
              <img src={getImageUrl(item.image)} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.category}</p>
              </div>
              <div className="flex gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><FaEye /> {item.views}</span>
                <span className="flex items-center gap-1"><FaHeart /> {item.likes}</span>
              </div>
            </>
          )}
        />
        <RecentSection
          title="Recent Blogs"
          viewAllLink="/admin/blogs"
          items={recentBlogs}
          renderItem={(item) => (
            <>
              <img src={getImageUrl(item.featuredImage)} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.category}</p>
              </div>
              <div className="flex gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><FaEye /> {item.views}</span>
                <span className="flex items-center gap-1"><FaHeart /> {item.likes}</span>
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, badge, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  };
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colors[color]}`}>
          <Icon />
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{label}</p>
          {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white mt-1 inline-block">{badge}</span>}
        </div>
      </div>
    </div>
  );
};

const RecentSection = ({ title, viewAllLink, items, renderItem }) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
      <Link to={viewAllLink} className="text-xs sm:text-sm text-primary hover:underline">View All →</Link>
    </div>
    {items.length === 0 ? (
      <p className="text-center py-8 text-slate-500">No items yet</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
            {renderItem(item)}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;