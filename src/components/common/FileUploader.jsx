import { useState } from 'react';
import { FaUpload, FaTimes, FaSpinner, FaFilePdf, FaFileWord } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FileUploader = ({ onFileUpload, currentFile, accept = '.pdf,.doc,.docx', maxSize = 10 * 1024 * 1024 }) => {
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState(
    currentFile ? { url: currentFile, name: 'Current file' } : null
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a PDF or DOC/DOCX file');
      return;
    }

    if (file.size > maxSize) {
      toast.error(`File size should be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    try {
      setUploading(true);
      const base64 = await convertToBase64(file);
      const response = await api.post('/upload', { image: base64 });
      const { url, fileType, fileSize } = response.data;
      setFileInfo({ url, name: file.name, size: fileSize, type: fileType });
      onFileUpload(url, fileType, fileSize);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
      setFileInfo(null);
      onFileUpload('', '', 0);
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemove = () => {
    setFileInfo(null);
    onFileUpload('', '', 0);
  };

  const getFileIcon = () => {
    if (!fileInfo) return null;
    if (fileInfo.type === 'pdf') return <FaFilePdf className="text-red-500 text-2xl" />;
    return <FaFileWord className="text-blue-500 text-2xl" />;
  };

  return (
    <div className="space-y-2">
      <label className="block cursor-pointer">
        {fileInfo ? (
          <div className="relative group border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileInfo.name}</p>
                {fileInfo.size && (
                  <p className="text-xs text-slate-500">{(fileInfo.size / 1024).toFixed(1)} KB</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                title="Remove file"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
            {uploading ? (
              <>
                <FaSpinner className="mx-auto text-2xl text-primary animate-spin mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Uploading...</p>
              </>
            ) : (
              <>
                <FaUpload className="mx-auto text-2xl text-primary mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Click to upload file</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUploader;