import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileAPI } from '../../utils/api';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileAPI.getProfile()
      .then(res => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const socialIcons = {
    github: FaGithub,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram,
    website: FaGlobe,
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">MyPortfolio</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {profile?.bio 
                ? profile.bio.substring(0, 100) + '...'
                : 'Building modern web experiences with care and precision.'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-primary transition">Home</Link></li>
              <li><Link to="/projects" className="text-slate-600 dark:text-slate-400 hover:text-primary transition">Projects</Link></li>
              <li><Link to="/blog" className="text-slate-600 dark:text-slate-400 hover:text-primary transition">Blog</Link></li>
              <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex space-x-4">
              {!loading && profile?.socialLinks && (
                Object.entries(profile.socialLinks).map(([key, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[key] || FaGlobe;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      aria-label={key}
                    >
                      <Icon />
                    </a>
                  );
                })
              )}
              {/* Fallback icons if no social links */}
              {(!profile?.socialLinks || Object.values(profile.socialLinks).every(v => !v)) && (
                <>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaGithub />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <FaLinkedin />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500 dark:text-slate-500">
          © {year} MyPortfolio. Made with <FaHeart className="inline text-red-500 mx-1" /> using MERN Stack
        </div>
      </div>
    </footer>
  );
};

export default Footer;