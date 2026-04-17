import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/common/ImageUploader';
import { FaSave, FaTimes, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const isViewer = user?.role === 'viewer';
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profileImage: '',
    contactEmail: '',
    phone: '',
    address: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      website: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await profileAPI.getProfile();
        const { name, title, bio, profileImage, contactEmail, phone, address, socialLinks } = res.data;
        setFormData({
          name: name || '',
          title: title || '',
          bio: bio || '',
          profileImage: profileImage || '',
          contactEmail: contactEmail || '',
          phone: phone || '',
          address: address || '',
          socialLinks: {
            github: socialLinks?.github || '',
            linkedin: socialLinks?.linkedin || '',
            twitter: socialLinks?.twitter || '',
            facebook: socialLinks?.facebook || '',
            instagram: socialLinks?.instagram || '',
            website: socialLinks?.website || '',
          },
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewer) return;
    setLoading(true);
    try {
      await profileAPI.updateProfile(formData);
      await refreshUser();
      toast.success('Profile updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Edit Profile</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Update your personal information and contact details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4 sm:p-6 space-y-4">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile Image</label>
          <ImageUploader
            currentImage={formData.profileImage}
            onImageUpload={(url) => setFormData({ ...formData, profileImage: url })}
            disabled={isViewer}
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            disabled={loading || isViewer}
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Professional Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            disabled={loading || isViewer}
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio / Description</label>
          <textarea
            id="bio"
            name="bio"
            rows="5"
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            disabled={loading || isViewer}
          />
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700">Contact Information</h3>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              disabled={loading || isViewer}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              disabled={loading || isViewer}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address / Location</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              disabled={loading || isViewer}
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700">Social Links</h3>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SocialInput icon={FaGithub} name="social.github" value={formData.socialLinks.github} onChange={handleChange} disabled={loading || isViewer} placeholder="GitHub URL" />
          <SocialInput icon={FaLinkedin} name="social.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} disabled={loading || isViewer} placeholder="LinkedIn URL" />
          <SocialInput icon={FaTwitter} name="social.twitter" value={formData.socialLinks.twitter} onChange={handleChange} disabled={loading || isViewer} placeholder="Twitter URL" />
          <SocialInput icon={FaFacebook} name="social.facebook" value={formData.socialLinks.facebook} onChange={handleChange} disabled={loading || isViewer} placeholder="Facebook URL" />
          <SocialInput icon={FaInstagram} name="social.instagram" value={formData.socialLinks.instagram} onChange={handleChange} disabled={loading || isViewer} placeholder="Instagram URL" />
          <SocialInput icon={FaGlobe} name="social.website" value={formData.socialLinks.website} onChange={handleChange} disabled={loading || isViewer} placeholder="Personal Website URL" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {!isViewer && (
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : <><FaSave className="mr-2" /> Save Changes</>}
            </button>
          )}
          <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn-outline flex-1" disabled={loading}>
            <FaTimes className="mr-2" /> Cancel
          </button>
        </div>
        {isViewer && (
          <p className="text-sm text-center text-slate-500 dark:text-slate-400">Viewer accounts cannot edit profile information.</p>
        )}
      </form>
    </div>
  );
};

const SocialInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
    />
  </div>
);

export default EditProfile;