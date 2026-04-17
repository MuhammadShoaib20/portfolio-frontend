import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaGithub, FaExternalLinkAlt, FaHeart, FaArrowLeft, FaEye } from 'react-icons/fa';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getById(id);
      setProject(res.data.project);
    } catch (error) {
      toast.error('Project not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
    window.scrollTo(0, 0);
  }, [fetchProject]);

  const handleLike = async () => {
    try {
      const res = await projectsAPI.like(project._id);
      setProject(prev => ({ ...prev, likes: res.data.likes }));
      toast.success('Thanks for liking!');
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-primary hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-5xl">
        <Link to="/projects" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <FaArrowLeft /> Back to Projects
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <header>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{project.title}</h1>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {project.category}
              </span>
            </header>

            {project.image && (
              <figure className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={project.image} alt={project.title} className="w-full h-auto" />
              </figure>
            )}

            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">About This Project</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{project.description}</p>
              {project.fullDescription && (
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                  {project.fullDescription.split('\n').map((para, idx) => para.trim() && <p key={idx}>{para}</p>)}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {project.technologies?.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-white/30 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-sm text-slate-700 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.status && (
              <div className="card p-6">
                <h3 className="font-semibold mb-3">Status</h3>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">{project.status}</span>
              </div>
            )}

            <div className="card p-6">
              <h3 className="font-semibold mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaEye /> <span>{project.views || 0} Views</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <FaHeart /> <span>{project.likes || 0} Likes</span>
                </div>
              </div>
            </div>

            {(project.liveUrl || project.githubUrl) && (
              <div className="card p-6">
                <h3 className="font-semibold mb-3">Links</h3>
                <div className="flex flex-col gap-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                      <FaExternalLinkAlt className="mr-2" /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center">
                      <FaGithub className="mr-2" /> View Code
                    </a>
                  )}
                </div>
              </div>
            )}

            <button onClick={handleLike} className="btn-primary w-full justify-center">
              <FaHeart className="mr-2" /> Like This Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;