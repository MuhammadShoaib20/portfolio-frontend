import { useState, useEffect, useRef } from 'react';
import { resumeAPI } from '../../utils/api';
import { FaDownload, FaFilePdf, FaFileWord, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ResumeDownloadButton = ({ variant = 'primary' }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const res = await resumeAPI.getActive();
        // ✅ FIX: ensure resumes is always an array
        setResumes(res.data?.resumes || []);
      } catch (error) {
        console.error('Failed to fetch resumes', error);
        toast.error('Could not load resumes');
        setResumes([]); // ✅ fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFileIcon = (type) => {
    if (type === 'pdf') return <FaFilePdf className="text-red-500" />;
    return <FaFileWord className="text-blue-500" />;
  };

  const handleDownload = async (resume) => {
    setDownloadingId(resume._id);
    try {
      // Backend proxy endpoint use karo — Cloudinary URL nahi
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/resumes/download/${resume._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = resume.title.replace(/\s+/g, '_') + '.' + resume.fileType;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloading ${resume.title}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloadingId(null);
      setIsOpen(false);
    }
  };

  // ✅ Now resumes is always an array, so .length is safe
  if (resumes.length === 0) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-${variant} flex items-center gap-2`}
        disabled={loading}
      >
        <FaDownload /> Download Resume
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-medium">Select a version</h4>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {resumes.map((resume) => (
              <button
                key={resume._id}
                onClick={() => handleDownload(resume)}
                disabled={downloadingId === resume._id}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3 transition disabled:opacity-50"
              >
                {downloadingId === resume._id ? (
                  <FaSpinner className="animate-spin text-primary" />
                ) : (
                  getFileIcon(resume.fileType)
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{resume.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {resume.fileType.toUpperCase()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDownloadButton;