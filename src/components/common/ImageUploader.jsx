import { useState } from 'react';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const base64 = await convertToBase64(file);
      setPreview(base64);
      const response = await api.post('/upload', { image: base64 });
      onImageUpload(response.data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
      setPreview(currentImage || '');
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
    setPreview('');
    onImageUpload('');
  };

  return (
    <div className="space-y-2">
      <label className="block cursor-pointer">
        {preview ? (
          <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-white/30 dark:border-slate-700/30">
            <img src={preview} alt="Preview" className="w-full h-48 object-contain bg-slate-100 dark:bg-slate-800" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <FaTimes /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-white/30 dark:border-slate-700/30 rounded-xl p-8 text-center hover:bg-white/5 transition cursor-pointer">
            {uploading ? (
              <>
                <FaSpinner className="mx-auto text-3xl text-primary animate-spin mb-2" />
                <p className="text-slate-600 dark:text-slate-400">Uploading...</p>
              </>
            ) : (
              <>
                <FaUpload className="mx-auto text-3xl text-primary mb-2" />
                <p className="text-slate-900 dark:text-white font-medium">Click to upload image</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 5MB</p>
              </>
            )}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageUploader;