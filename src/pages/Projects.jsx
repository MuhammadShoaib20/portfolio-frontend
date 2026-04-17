import { useState, useEffect, useCallback } from 'react';
import { projectsAPI } from '../utils/api';
import ProjectCard from '../components/common/ProjectCard';
import toast from 'react-hot-toast';

const categories = ['all', 'Frontend', 'Full Stack', 'Mobile', 'UI/UX'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchProjects = useCallback(async (searchTerm = search) => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.category = filter;
      if (searchTerm) params.search = searchTerm;
      const res = await projectsAPI.getAll(params);
      setProjects(res.data.projects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleFilterChange = (cat) => {
    setFilter(cat);
    setSearch('');
    setSearchInput('');
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-12">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Selected Projects
          </h1>
          <p className="text-sm xs:text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Explore my recent work and case studies
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 py-3 xs:py-4 mb-6 xs:mb-8 -mx-3 xs:-mx-4 sm:mx-0 px-3 xs:px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 xs:gap-4">
            {/* Categories - horizontal scroll on mobile */}
            <div className="w-full overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 xs:gap-2 pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleFilterChange(cat)}
                    className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                      filter === cat
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-1 xs:gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 sm:w-64 px-3 xs:px-4 py-1.5 xs:py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-xs xs:text-sm"
              />
              <button
                type="submit"
                className="px-3 xs:px-6 py-1.5 xs:py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition text-xs xs:text-sm whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 xs:h-64 sm:h-80 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 xs:py-20 text-slate-500 dark:text-slate-500">
            <h3 className="text-lg xs:text-xl font-semibold mb-2">No projects found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;