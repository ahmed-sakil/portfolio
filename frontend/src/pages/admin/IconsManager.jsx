import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  Plus, 
  X, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import AppIcon from '../../components/icons/AppIcon';

const IconsManager = () => {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon_type: 'light' // 'light' | 'dark'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchIcons();
  }, []);

  const fetchIcons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/icons');
      setIcons(res.data || []);
    } catch (err) {
      console.error('Failed to load icons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      if (!formData.name) {
        const guessedName = file.name.split('.')[0].replace(/[-_]/g, ' ');
        setFormData((prev) => ({ ...prev, name: guessedName }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !formData.url) {
      alert('Please select an icon file or enter an image URL.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name || 'Custom Icon');
      data.append('icon_type', formData.icon_type);
      if (selectedFile) {
        data.append('icon', selectedFile);
      } else {
        data.append('url', formData.url);
      }

      await api.post('/admin/icons', data);
      
      // Reset form
      setFormData({ name: '', url: '', icon_type: 'light' });
      setSelectedFile(null);
      setFilePreview(null);
      setShowForm(false);
      await fetchIcons();
    } catch (err) {
      console.error('Upload icon failed:', err);
      alert(err.response?.data?.message || 'Failed to upload custom icon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom icon?')) return;
    try {
      await api.delete(`/admin/icons/${id}`);
      setIcons(icons.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to delete icon:', err);
      alert('Failed to delete icon');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentPreviewUrl = filePreview || formData.url;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Asset Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Custom Icons Library
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Upload custom icons (SVG, PNG) or add image URLs. Select them in Skills, Social Links, or highlight dark icons with a light contrast plate.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-teal-500/20 text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 active:scale-95 shrink-0"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Upload New Icon
            </>
          )}
        </button>
      </div>

      {/* Upload / Add Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl border border-teal-400/30 bg-slate-900/80 backdrop-blur-md shadow-2xl space-y-6 animate-fadeIn"
        >
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-400" />
              Add New Custom Icon
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Icons uploaded here will be permanently stored on Cloudinary and selectable across your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Icon Name / Label <span className="text-teal-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, OpenAI, Supabase, My Logo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800/70 text-white text-sm focus:outline-none focus:border-teal-400 transition"
                  required
                />
              </div>

              {/* Upload File */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Upload Icon File (SVG, PNG, WebP)
                </label>
                <div className="border-2 border-dashed border-white/15 hover:border-teal-400/50 rounded-xl p-4 text-center cursor-pointer transition bg-slate-800/30">
                  <input
                    type="file"
                    id="iconFileInput"
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="iconFileInput" className="cursor-pointer block">
                    <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
                    <span className="text-xs text-teal-400 font-semibold">Click to select icon file</span>
                    <p className="text-[11px] text-gray-500 mt-1">Recommended: Square SVG or PNG with transparent background</p>
                  </label>
                  {selectedFile && (
                    <div className="mt-2 text-xs text-emerald-400 font-mono font-medium flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* OR Direct URL */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Or enter Direct Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/icon.svg"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-800/70 text-white text-sm focus:outline-none focus:border-teal-400 transition"
                />
              </div>

              {/* Icon Type: Light vs Dark */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Icon Visual Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_type: 'light' })}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                      formData.icon_type === 'light'
                        ? 'border-teal-400 bg-teal-400/10 text-white'
                        : 'border-white/10 bg-slate-800/40 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Light / Colored</div>
                      <div className="text-[10px] text-gray-400">Works well on dark themes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, icon_type: 'dark' })}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                      formData.icon_type === 'dark'
                        ? 'border-teal-400 bg-teal-400/10 text-white'
                        : 'border-white/10 bg-slate-800/40 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Dark / Black Icon</div>
                      <div className="text-[10px] text-gray-400">Adds light contrast plate</div>
                    </div>
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  💡 Choose <strong>"Dark / Black Icon"</strong> if the icon has black or dark lines so it won't disappear on your dark portfolio!
                </p>
              </div>
            </div>

            {/* Right: Live Preview Panel */}
            <div className="flex flex-col justify-between p-5 rounded-xl border border-white/10 bg-slate-800/40">
              <div>
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                  Live Preview
                </h3>

                {currentPreviewUrl ? (
                  <div className="space-y-4">
                    {/* Dark Theme Context */}
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1.5">How it looks on Dark Portfolio Background:</span>
                      <div className="p-4 rounded-xl border border-white/10 bg-[#0f172a] flex items-center justify-center gap-3">
                        <AppIcon
                          iconUrl={currentPreviewUrl}
                          iconType={formData.icon_type}
                          className="w-8 h-8"
                          alt="preview"
                        />
                        <span className="text-sm font-semibold text-white">
                          {formData.name || 'Sample Item'}
                        </span>
                      </div>
                    </div>

                    {/* Light Context */}
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1.5">How it looks on Light Surface:</span>
                      <div className="p-4 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-3">
                        <AppIcon
                          iconUrl={currentPreviewUrl}
                          iconType="light"
                          className="w-8 h-8"
                          alt="preview"
                        />
                        <span className="text-sm font-semibold text-slate-900">
                          {formData.name || 'Sample Item'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-4 text-gray-500">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">Select a file or enter a URL to see live preview</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs transition shadow-lg text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save to Library'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Icon Gallery Grid */}
      <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Custom Icons in Library</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {icons.length} custom {icons.length === 1 ? 'icon' : 'icons'} configured
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading custom icons...</div>
        ) : icons.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-white/10 rounded-2xl">
            <Sparkles className="w-10 h-10 text-teal-400/40 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-300">No Custom Icons Uploaded Yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Click the "Upload New Icon" button above to upload custom SVG/PNG logos or images for your skills and socials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="group relative p-4 rounded-xl border border-white/10 bg-slate-800/40 hover:border-teal-400/40 hover:bg-slate-800/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-white/10 bg-slate-900/90 flex items-center justify-center p-2 shrink-0">
                        <AppIcon
                          iconUrl={icon.url}
                          iconType={icon.icon_type}
                          className="w-7 h-7"
                          alt={icon.name}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white truncate max-w-[130px]" title={icon.name}>
                          {icon.name}
                        </h3>
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${
                            icon.icon_type === 'dark'
                              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                              : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                          }`}
                        >
                          {icon.icon_type === 'dark' ? 'Dark (Highlighted)' : 'Light'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(icon.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      title="Delete Icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <a
                    href={icon.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-teal-400 flex items-center gap-1 transition text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" /> View Asset
                  </a>

                  <button
                    onClick={() => copyToClipboard(icon.url, icon.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
                    title="Copy Image URL"
                  >
                    {copiedId === icon.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy URL
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconsManager;
