import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { profileAPI, projectsAPI, blogsAPI, contactAPI } from '../utils/api';
import ResumeDownloadButton from '../components/common/ResumeDownloadButton';
import BlogCard from '../components/common/BlogCard';
import toast from 'react-hot-toast';
import {
  FaArrowRight, FaGithub, FaLinkedin, FaTwitter, FaFacebook,
  FaInstagram, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaPaperPlane, FaArrowUp, FaExternalLinkAlt,
  FaNodeJs, FaGitAlt, FaJs, FaServer, FaReact,
} from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss } from 'react-icons/si';

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const SKILLS = [
  { name: 'React',        icon: FaReact,      color: '#61DAFB' },
  { name: 'Node.js',      icon: FaNodeJs,     color: '#68A063' },
  { name: 'Express',      icon: SiExpress,    color: '#8b8b8b' },
  { name: 'MongoDB',      icon: SiMongodb,    color: '#47A248' },
  { name: 'Tailwind CSS', icon: SiTailwindcss,color: '#38BDF8' },
  { name: 'JavaScript',   icon: FaJs,         color: '#F7DF1E' },
  { name: 'REST APIs',    icon: FaServer,     color: '#F97316' },
  { name: 'Git',          icon: FaGitAlt,     color: '#F05032' },
];

const STATS = [
  { value: '1+', label: 'Years Experience',       icon: '⚡' },
  { value: '3+', label: 'Projects Completed',     icon: '🚀' },
  { value: '6+', label: 'Technologies Mastered',  icon: '🛠️' },
];

const TAGLINE_WORDS = [
  'MERN Stack Developer',
  'React Specialist',
  'Node.js Engineer',
  'MongoDB Architect',
];

const PLACEHOLDER_PROJECTS = [
  {
    _id: 'ph1', title: 'ShopHub E-Commerce', category: 'Full Stack',
    description: 'Full-stack e-commerce platform with payment integration, admin dashboard, and real-time inventory tracking.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    image: 'https://placehold.co/600x400/1e293b/38bdf8?text=ShopHub',
    liveUrl: '', githubUrl: '',
  },
  {
    _id: 'ph2', title: 'SyncChat App', category: 'Full Stack',
    description: 'Real-time chat application using WebSockets with rooms, direct messages, and online presence indicators.',
    technologies: ['React', 'Socket.io', 'Express', 'MongoDB'],
    image: 'https://placehold.co/600x400/1e293b/a78bfa?text=SyncChat',
    liveUrl: '', githubUrl: '',
  },
  {
    _id: 'ph3', title: 'Dev Portfolio CMS', category: 'Full Stack',
    description: 'Full-featured portfolio CMS with blog engine, project manager, resume downloads, and role-based admin.',
    technologies: ['React', 'Node.js', 'Cloudinary', 'JWT'],
    image: 'https://placehold.co/600x400/1e293b/34d399?text=Portfolio',
    liveUrl: '', githubUrl: '',
  },
];

const SOCIAL_ICONS = {
  github: FaGithub, linkedin: FaLinkedin, twitter: FaTwitter,
  facebook: FaFacebook, instagram: FaInstagram, website: FaGlobe,
};

/* ─────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─────────────────────────────────────────
   SMOOTH SCROLL (accounts for 80px navbar)
───────────────────────────────────────── */
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
};

/* ─────────────────────────────────────────
   TYPING ANIMATION COMPONENT
───────────────────────────────────────── */
const TypingText = () => {
  const [wordIdx, setWordIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused]     = useState(false);

  useEffect(() => {
    const word = TAGLINE_WORDS[wordIdx];
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false); }, 1600);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed === word) { setPaused(true); return; }
    const speed = deleting ? 36 : 68;
    const t = setTimeout(() => {
      if (deleting) {
        setDisplayed(w => w.slice(0, -1));
        if (displayed.length === 1) { setDeleting(false); setWordIdx(i => (i + 1) % TAGLINE_WORDS.length); }
      } else {
        setDisplayed(word.slice(0, displayed.length + 1));
      }
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, deleting, paused, wordIdx]);

  return (
    <span className="text-primary font-bold">
      {displayed}
      <span aria-hidden className="inline-block w-0.5 h-[0.85em] bg-primary ml-0.5 align-middle animate-pulse" />
    </span>
  );
};

/* ─────────────────────────────────────────
   SKELETON PLACEHOLDER
───────────────────────────────────────── */
const SkeletonCard = ({ height = 'h-72' }) => (
  <div className={`${height} rounded-2xl bg-slate-200 dark:bg-slate-700/60 animate-pulse`} />
);

/* ─────────────────────────────────────────
   BACK TO TOP BUTTON
───────────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-24 right-6 z-40 w-11 h-11 rounded-full bg-primary text-white
                     shadow-lg hover:bg-primary-dark hover:shadow-xl transition-all
                     flex items-center justify-center"
        >
          <FaArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      variants={fadeUp} custom={index} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="flex items-center gap-4 p-6 rounded-2xl
                 bg-slate-50 dark:bg-slate-800/60
                 border border-slate-100 dark:border-slate-700/60
                 hover:border-primary/40 dark:hover:border-primary/40
                 hover:shadow-md transition-all duration-300"
    >
      <span className="text-4xl" aria-hidden>{stat.icon}</span>
      <div>
        <p className="text-3xl font-black text-primary leading-none">{stat.value}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   FEATURED PROJECT CARD
───────────────────────────────────────── */
const FeaturedProjectCard = ({ project, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.article ref={ref}
      variants={scaleUp} custom={index} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300
                 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image?.trim() || 'https://placehold.co/600x400?text=Project'}
          alt={`${project.title} preview`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                        transition-opacity flex items-center justify-center gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
               aria-label={`Live demo of ${project.title}`}
               className="w-10 h-10 rounded-full bg-white flex items-center justify-center
                          text-primary hover:bg-primary hover:text-white transition">
              <FaExternalLinkAlt size={13} />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
               aria-label={`GitHub for ${project.title}`}
               className="w-10 h-10 rounded-full bg-white flex items-center justify-center
                          text-primary hover:bg-primary hover:text-white transition">
              <FaGithub size={14} />
            </a>
          )}
        </div>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full
                         bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold">
          {project.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies?.slice(0, 4).map((t, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full
                                     bg-slate-100 dark:bg-slate-700
                                     text-slate-700 dark:text-slate-300">
              {t}
            </span>
          ))}
          {project.technologies?.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700
                             text-slate-500 dark:text-slate-400">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-auto">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
               className="flex-1 py-2 px-3 bg-primary text-white text-sm font-medium
                          rounded-lg hover:bg-primary-dark transition
                          flex items-center justify-center gap-1.5">
              <FaExternalLinkAlt size={11} /> Live Demo
            </a>
          ) : null}
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
               className="flex-1 py-2 px-3 border border-slate-300 dark:border-slate-600
                          text-sm font-medium rounded-lg
                          hover:bg-slate-50 dark:hover:bg-slate-700 transition
                          flex items-center justify-center gap-1.5">
              <FaGithub size={12} /> GitHub
            </a>
          ) : null}
          {!project.liveUrl && !project.githubUrl && (
            <Link to={`/projects/${project._id}`}
              className="flex-1 py-2 px-3 bg-primary text-white text-sm font-medium
                         rounded-lg hover:bg-primary-dark transition text-center">
              View Details →
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ─────────────────────────────────────────
   SKILL CARD
───────────────────────────────────────── */
const SkillCard = ({ skill, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const Icon = skill.icon;
  return (
    <motion.div ref={ref}
      variants={scaleUp} custom={index} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.07, transition: { duration: 0.17 } }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl
                 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-primary/40
                 transition-all duration-300 cursor-default"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
           style={{ backgroundColor: `${skill.color}22` }}>
        <Icon size={26} style={{ color: skill.color }} aria-hidden />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill.name}</span>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   ANIMATED BLOG CARD
───────────────────────────────────────── */
const AnimatedBlogCard = ({ blog, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      variants={scaleUp} custom={index} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}>
      <BlogCard blog={blog} />
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   SECTION HEADER (with scroll-reveal)
───────────────────────────────────────── */
const SectionHeader = ({ eyebrow, title, subtitle, center = false, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className={`mb-12 ${center
        ? 'text-center'
        : 'flex flex-col sm:flex-row sm:items-end justify-between gap-4'
      }`}
    >
      <div>
        <span className="text-primary text-sm font-semibold tracking-widest uppercase mb-2 block">
          {eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-md mx-auto">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   CONTACT SECTION (isolated to keep hooks clean)
───────────────────────────────────────── */
const ContactSection = ({ profile }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const infoRef = useRef(null);
  const formRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true });
  const formInView = useInView(formRef, { once: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      await contactAPI.send({ ...form, subject: 'Portfolio Contact' });
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
      {/* Info panel */}
      <motion.div ref={infoRef}
        variants={fadeUp} custom={0} initial="hidden"
        animate={infoInView ? 'visible' : 'hidden'}
        className="lg:col-span-2 space-y-5"
      >
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Info</h3>
          <div className="space-y-4">
            {profile?.contactEmail && (
              <a href={`mailto:${profile.contactEmail}`}
                 className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center
                                 justify-center text-primary flex-shrink-0">
                  <FaEnvelope size={14} />
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400
                                 group-hover:text-primary transition break-all">
                  {profile.contactEmail}
                </span>
              </a>
            )}
            {profile?.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center gap-3 group">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center
                                 justify-center text-primary flex-shrink-0">
                  <FaPhone size={14} />
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400
                                 group-hover:text-primary transition">
                  {profile.phone}
                </span>
              </a>
            )}
            {profile?.address && (
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center
                                 justify-center text-primary flex-shrink-0">
                  <FaMapMarkerAlt size={14} />
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {profile.address}
                </span>
              </div>
            )}
            {!profile?.contactEmail && !profile?.phone && !profile?.address && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Use the form to get in touch!
              </p>
            )}
          </div>
        </div>

        {/* Social icons */}
        {profile?.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800
                          border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4
                          uppercase tracking-widest">
              Follow Me
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(profile.socialLinks).map(([key, url]) => {
                if (!url) return null;
                const Icon = SOCIAL_ICONS[key] || FaGlobe;
                return (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                     aria-label={`${key} profile`}
                     className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700
                                bg-white dark:bg-slate-700 flex items-center justify-center
                                text-slate-500 dark:text-slate-400 hover:text-primary
                                hover:border-primary/40 hover:scale-110 transition-all duration-200">
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Contact form */}
      <motion.div ref={formRef}
        variants={fadeUp} custom={1} initial="hidden"
        animate={formInView ? 'visible' : 'hidden'}
        className="lg:col-span-3"
      >
        <form onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800
                     border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hp-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Name *
              </label>
              <input id="hp-name" type="text" placeholder="Your Name"
                value={form.name} required disabled={sending}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300
                           dark:border-slate-600 bg-white dark:bg-slate-700
                           text-slate-900 dark:text-white placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-primary/40
                           focus:border-primary transition disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="hp-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email *
              </label>
              <input id="hp-email" type="email" placeholder="your@email.com"
                value={form.email} required disabled={sending}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300
                           dark:border-slate-600 bg-white dark:bg-slate-700
                           text-slate-900 dark:text-white placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-primary/40
                           focus:border-primary transition disabled:opacity-60"
              />
            </div>
          </div>
          <div>
            <label htmlFor="hp-msg"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Message *
            </label>
            <textarea id="hp-msg" rows={5} placeholder="Tell me about your project…"
              value={form.message} required disabled={sending}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300
                         dark:border-slate-600 bg-white dark:bg-slate-700
                         text-slate-900 dark:text-white placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-primary/40
                         focus:border-primary transition resize-none disabled:opacity-60"
            />
          </div>
          <motion.button type="submit" disabled={sending}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-primary to-indigo-600
                       shadow-lg shadow-primary/20 hover:shadow-primary/35
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-shadow flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white
                                 rounded-full animate-spin" />
                Sending…
              </>
            ) : (
              <><FaPaperPlane size={13} /> Send Message</>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   HOME PAGE — MAIN COMPONENT
═══════════════════════════════════════════ */
const Home = () => {
  const [profile, setProfile]               = useState(null);
  const [projects, setProjects]             = useState([]);
  const [blogs, setBlogs]                   = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading]     = useState(true);

  const heroRef    = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  /* ── Data fetching ── */
  useEffect(() => {
    profileAPI.getProfile()
      .then(r => setProfile(r.data))
      .catch(console.error)
      .finally(() => setProfileLoading(false));

    projectsAPI.getAll({ featured: true })
      .then(r => {
        const arr = r.data?.projects || [];
        setProjects(arr.length ? arr.slice(0, 3) : PLACEHOLDER_PROJECTS);
      })
      .catch(() => setProjects(PLACEHOLDER_PROJECTS))
      .finally(() => setProjectsLoading(false));

    blogsAPI.getAll({ limit: 3, isPublished: true })
      .then(r => setBlogs(r.data?.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setBlogsLoading(false));
  }, []);

  return (
    <>
      <BackToTop />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden
                   bg-gradient-to-br from-slate-50 via-white to-blue-50/30
                   dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      >
        {/* Decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
                          bg-primary/6 dark:bg-primary/4 blur-3xl" />
          <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full
                          bg-indigo-400/6 dark:bg-indigo-400/4 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.022] dark:opacity-[0.035]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                                linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: '56px 56px',
            }}
          />
        </div>

        <div className="container-custom relative z-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Text column */}
            <div className="order-2 lg:order-1">
              <motion.span
                variants={fadeUp} custom={0} initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                           bg-primary/10 dark:bg-primary/15 border border-primary/25
                           text-primary text-sm font-semibold mb-6"
              >
                <span aria-hidden className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Available for work
              </motion.span>

              <motion.h1
                variants={fadeUp} custom={1} initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight
                           text-slate-900 dark:text-white mb-4 leading-[1.05]"
              >
                {profileLoading ? (
                  <span className="block h-[1.1em] w-72 rounded-2xl
                                   bg-slate-200 dark:bg-slate-700 animate-pulse" />
                ) : (profile?.name || 'Muhammad Shoaib')}
              </motion.h1>

              <motion.p
                variants={fadeUp} custom={2} initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-5 min-h-[2rem]"
              >
                <TypingText />
              </motion.p>

              <motion.p
                variants={fadeUp} custom={3} initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-400
                           max-w-lg leading-relaxed mb-8"
              >
                {profileLoading ? (
                  <span className="block h-20 rounded-xl
                                   bg-slate-200 dark:bg-slate-700 animate-pulse" />
                ) : (
                  profile?.bio
                    ? profile.bio.slice(0, 190) + (profile.bio.length > 190 ? '…' : '')
                    : 'Building fast, accessible, and beautiful web experiences with the MERN stack.'
                )}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeUp} custom={4} initial="hidden"
                animate={heroInView ? 'visible' : 'hidden'}
                className="flex flex-wrap gap-3 mb-10"
              >
                <button
                  onClick={() => scrollTo('projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                             text-white bg-gradient-to-r from-primary to-indigo-600
                             shadow-lg shadow-primary/25 hover:shadow-primary/40
                             hover:scale-105 transition-all duration-200"
                >
                  View Projects <FaArrowRight size={12} aria-hidden />
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                             border border-slate-300 dark:border-slate-600
                             text-slate-700 dark:text-slate-200
                             hover:bg-slate-100 dark:hover:bg-slate-800
                             hover:border-primary/50 transition-all duration-200"
                >
                  Contact Me
                </button>
                <ResumeDownloadButton variant="outline" />
              </motion.div>

              {/* Social links */}
              {!profileLoading && profile?.socialLinks && (
                <motion.div
                  variants={fadeUp} custom={5} initial="hidden"
                  animate={heroInView ? 'visible' : 'hidden'}
                  className="flex flex-wrap items-center gap-3"
                >
                  {Object.entries(profile.socialLinks).map(([key, url]) => {
                    if (!url) return null;
                    const Icon = SOCIAL_ICONS[key] || FaGlobe;
                    return (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                         aria-label={`Visit ${key} profile`}
                         className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700
                                    bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center
                                    text-slate-500 dark:text-slate-400 hover:text-primary
                                    hover:border-primary/40 hover:scale-110 transition-all duration-200">
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Image column */}
            <div className="order-1 lg:order-2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.82, rotate: -4 }}
                animate={heroInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative"
              >
                {/* Glow halo */}
                <div aria-hidden
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-tr
                              from-primary/20 via-indigo-400/10 to-transparent blur-2xl" />

                {profileLoading ? (
                  <div className="w-64 sm:w-80 lg:w-96 aspect-square rounded-3xl
                                  bg-slate-200 dark:bg-slate-700 animate-pulse" />
                ) : profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.name || 'Developer'} – MERN Stack Developer`}
                    className="relative w-64 sm:w-80 lg:w-96 aspect-square object-cover
                               rounded-3xl shadow-2xl border-2 border-white/60
                               dark:border-slate-700/50"
                  />
                ) : (
                  <div className="relative w-64 sm:w-80 lg:w-96 aspect-square rounded-3xl
                                  bg-gradient-to-br from-primary/15 to-indigo-500/15
                                  border-2 border-white/50 dark:border-slate-700/50
                                  flex items-center justify-center">
                    <span className="text-8xl" role="img" aria-label="Developer emoji">👨‍💻</span>
                  </div>
                )}

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.75, duration: 0.45 }}
                  className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700
                             rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
                >
                  <span className="text-green-500 text-base" aria-hidden>●</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Open to Work
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -24 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9, duration: 0.45 }}
                  className="absolute -top-5 -right-5 bg-white dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700
                             rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
                >
                  <span className="text-xl" aria-hidden>🔥</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    170+ Contributions
                  </span>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section id="stats"
        className="py-16 bg-white dark:bg-slate-900
                   border-y border-slate-100 dark:border-slate-800"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STATS.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PROJECTS ══════════════════════ */}
      <section id="projects" className="py-20 bg-slate-50/50 dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader eyebrow="Portfolio" title="Featured Projects">
            <Link to="/projects"
              className="inline-flex items-center gap-2 text-primary font-semibold
                         hover:gap-3 transition-all duration-200 flex-shrink-0 whitespace-nowrap">
              View All Projects <FaArrowRight size={12} aria-hidden />
            </Link>
          </SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsLoading
              ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
              : projects.map((p, i) => <FeaturedProjectCard key={p._id} project={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* ══════════════════════ SKILLS ══════════════════════ */}
      <section id="skills" className="py-20 bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Expertise"
            title="Tech Stack & Skills"
            subtitle="The tools and technologies I use to bring ideas to life."
            center
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SKILLS.map((skill, i) => <SkillCard key={skill.name} skill={skill} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BLOG ══════════════════════ */}
      {blogsLoading && (
        <section className="py-20 bg-slate-50/50 dark:bg-slate-950">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} height="h-80" />)}
            </div>
          </div>
        </section>
      )}

      {!blogsLoading && blogs.length > 0 && (
        <section id="blog" className="py-20 bg-slate-50/50 dark:bg-slate-950">
          <div className="container-custom">
            <SectionHeader eyebrow="Writing" title="Recent Blog Posts">
              <Link to="/blog"
                className="inline-flex items-center gap-2 text-primary font-semibold
                           hover:gap-3 transition-all duration-200 flex-shrink-0 whitespace-nowrap">
                Read All Posts <FaArrowRight size={12} aria-hidden />
              </Link>
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, i) => <AnimatedBlogCard key={blog._id} blog={blog} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ CONTACT ══════════════════════ */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Get In Touch"
            title="Let's Connect"
            subtitle="Have a project in mind or want to collaborate? I'd love to hear from you."
            center
          />
          <ContactSection profile={profile} />
        </div>
      </section>
    </>
  );
};

export default Home;