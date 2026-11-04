import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  label = 'Upload Image to Cloudinary',
}) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient<{ url: string }>('/upload', {
        method: 'POST',
        body: formData,
      });

      onUploadSuccess(res.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-mono text-text-muted uppercase">{label}</label>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background border border-border hover:border-accent/50 cursor-pointer text-xs font-medium text-text-main transition-colors">
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-accent" />
          )}
          <span>{uploading ? 'Uploading to Cloudinary...' : 'Choose File'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {success && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Uploaded!</span>
          </div>
        )}

        {error && (
          <span className="text-xs text-rose-400 font-mono">{error}</span>
        )}
      </div>
    </div>
  );
};
