import { useState, useEffect } from 'react';
import { resumeAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaFilePdf, FaFileWord } from 'react-icons/fa';
import FileUploader from '../components/common/FileUploader';

const ResumeManagement = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
    fileType: 'pdf',
    fileSize: 0,
    isActive: true,
  });
  const [uploaderKey, setUploaderKey] = useState(0);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await resumeAPI.getAll();
      setResumes(res.data.resumes);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = (url, fileType, fileSize) => {
    console.log('File uploaded:', { url, fileType, fileSize });
    setFormData(prev => ({
      ...prev,
      fileUrl: url,
      fileType,
      fileSize,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      toast.error('Please provide a title and upload a file');
      return;
    }
    try {
      if (editing) {
        await resumeAPI.update(editing, formData);
        toast.success('Resume updated');
      } else {
        await resumeAPI.create(formData);
        toast.success('Resume added');
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ title: '', fileUrl: '', fileType: 'pdf', fileSize: 0, isActive: true });
      setUploaderKey(prev => prev + 1);
      fetchResumes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await resumeAPI.delete(id);
      toast.success('Resume deleted');
      fetchResumes();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleToggle = async (id) => {
    try {
      await resumeAPI.toggle(id);
      toast.success('Status updated');
      fetchResumes();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const openEditModal = (resume) => {
    setEditing(resume._id);
    setFormData({
      title: resume.title,
      fileUrl: resume.fileUrl,
      fileType: resume.fileType,
      fileSize: resume.fileSize,
      isActive: resume.isActive,
    });
    setShowModal(true);
    setUploaderKey(prev => prev + 1);
  };

  const openAddModal = () => {
    setEditing(null);
    setFormData({ title: '', fileUrl: '', fileType: 'pdf', fileSize: 0, isActive: true });
    setShowModal(true);
    setUploaderKey(prev => prev + 1);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    if (type === 'pdf') return <FaFilePdf className="text-red-500" />;
    return <FaFileWord className="text-blue-500" />;
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Resumes</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Add, edit, and enable/disable resume downloads</p>
        </div>
        {isSuperAdmin && (
          <button onClick={openAddModal} className="btn-primary text-sm sm:text-base">
            <FaPlus className="mr-2" /> Add Resume
          </button>
        )}
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">Add your first resume to enable downloads.</p>
          {isSuperAdmin && (
            <button onClick={openAddModal} className="btn-primary inline-flex">
              <FaPlus className="mr-2" /> Add Resume
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div key={resume._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getFileIcon(resume.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 dark:text-white truncate">{resume.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {resume.fileType.toUpperCase()} • {formatFileSize(resume.fileSize)}
                  </p>
                </div>
                {isSuperAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggle(resume._id)}
                      className={`p-2 rounded-lg transition ${resume.isActive ? 'text-green-500' : 'text-slate-400 hover:text-green-500'}`}
                      title={resume.isActive ? 'Disable' : 'Enable'}
                    >
                      {resume.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                    </button>
                    <button
                      onClick={() => openEditModal(resume)}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id, resume.title)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Added: {new Date(resume.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && isSuperAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Resume' : 'Add New Resume'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload File * (PDF, DOC, DOCX)</label>
                <FileUploader
                  key={uploaderKey}
                  currentFile={editing ? formData.fileUrl : ''}
                  onFileUpload={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  maxSize={10 * 1024 * 1024}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  id="isActive"
                  className="w-4 h-4 text-primary rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm">Active (visible on public pages)</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManagement;