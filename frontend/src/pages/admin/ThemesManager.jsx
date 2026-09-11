import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Palette, Plus, Edit2, Trash2, CheckCircle2, Sparkles, Check } from 'lucide-react';

const PRESET_THEMES = [
  {
    name: 'Emerald Dark (Default)',
    accent: '#00e5a0',
    bg_base: '#0a0f1e',
    bg_surface: 'rgba(15, 23, 42, 0.65)',
    text_primary: '#f8fafc',
  },
  {
    name: 'Cyberpunk Violet',
    accent: '#a855f7',
    bg_base: '#0d0714',
    bg_surface: 'rgba(28, 15, 43, 0.65)',
    text_primary: '#f5f3ff',
  },
  {
    name: 'Ocean Cyan',
    accent: '#06b6d4',
    bg_base: '#03131e',
    bg_surface: 'rgba(8, 35, 54, 0.65)',
    text_primary: '#ecfeff',
  },
  {
    name: 'Clean Bright',
    accent: '#0d9488',
    bg_base: '#f1f5f9',
    bg_surface: 'rgba(255, 255, 255, 0.85)',
    text_primary: '#0f172a',
  },
];

const ThemesManager = () => {
  const token = useAuthStore((state) => state.token);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    accent: '#00e5a0',
    bg_base: '#0a0f1e',
    bg_surface: 'rgba(15, 23, 42, 0.65)',
    text_primary: '#f8fafc',
    is_active: false,
  });

  const fetchThemes = async () => {
    try {
      const res = await api.get('/admin/themes');
      setThemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      accent: '#00e5a0',
      bg_base: '#0a0f1e',
      bg_surface: 'rgba(15, 23, 42, 0.65)',
      text_primary: '#f8fafc',
      is_active: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/themes/${editingId}`, formData);
      } else {
        await api.post('/admin/themes', formData);
      }
      resetForm();
      fetchThemes();
    } catch (err) {
      console.error(err);
      alert('Error saving theme');
    }
  };

  const handleEdit = (theme) => {
    setEditingId(theme.id);
    setFormData({
      name: theme.name,
      accent: theme.accent,
      bg_base: theme.bg_base,
      bg_surface: theme.bg_surface,
      text_primary: theme.text_primary,
      is_active: theme.is_active,
    });
  };

  const handleActivate = async (id) => {
    try {
      await api.patch(`/admin/themes/${id}/activate`, {});
      fetchThemes();
    } catch (err) {
      console.error(err);
      alert('Error activating theme');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theme?')) return;
    try {
      await api.delete(`/admin/themes/${id}`);
      fetchThemes();
    } catch (err) {
      console.error(err);
      alert('Error deleting theme');
    }
  };

  const applyPreset = (preset) => {
    setFormData({
      ...formData,
      name: preset.name,
      accent: preset.accent,
      bg_base: preset.bg_base,
      bg_surface: preset.bg_surface,
      text_primary: preset.text_primary,
    });
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Theme' : 'Add New Custom Theme'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Store custom design palettes in the database with customized accents, base backgrounds, and surface colors.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 p-4 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-xs font-semibold block mb-2" style={{ color: 'var(--text-secondary)' }}>
            Quick Color Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-teal-400/50 flex items-center gap-2 transition"
                style={{ background: 'var(--bg-surface-hover)' }}
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Theme Name</label>
              <input
                type="text"
                placeholder="e.g. Midnight Cyberpunk"
                required
                className="admin-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Primary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  value={formData.accent.startsWith('#') ? formData.accent : '#00e5a0'}
                  onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="#00e5a0"
                  required
                  className="admin-input flex-1 font-mono text-xs"
                  value={formData.accent}
                  onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="admin-label">Base Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  value={formData.bg_base.startsWith('#') ? formData.bg_base : '#0a0f1e'}
                  onChange={(e) => setFormData({ ...formData, bg_base: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="#0a0f1e"
                  required
                  className="admin-input flex-1 font-mono text-xs"
                  value={formData.bg_base}
                  onChange={(e) => setFormData({ ...formData, bg_base: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Card / Surface Color</label>
              <input
                type="text"
                placeholder="rgba(15, 23, 42, 0.65)"
                required
                className="admin-input font-mono text-xs"
                value={formData.bg_surface}
                onChange={(e) => setFormData({ ...formData, bg_surface: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Primary Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                  value={formData.text_primary.startsWith('#') ? formData.text_primary : '#f8fafc'}
                  onChange={(e) => setFormData({ ...formData, text_primary: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="#f8fafc"
                  required
                  className="admin-input flex-1 font-mono text-xs"
                  value={formData.text_primary}
                  onChange={(e) => setFormData({ ...formData, text_primary: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-teal-400 bg-slate-900 border-white/20 focus:ring-teal-400"
            />
            <label htmlFor="is_active" className="text-sm font-semibold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
              Set as Active Theme
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Theme' : 'Save Theme to Database'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Themes List Card */}
      <div className="admin-card p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Saved Database Themes ({themes.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading themes...
          </div>
        ) : themes.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No custom themes saved in database yet. Add your first theme or pick a preset above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {themes.map((thm) => (
              <div
                key={thm.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all relative overflow-hidden"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: thm.is_active ? 'var(--accent)' : 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base text-white" style={{ color: 'var(--text-primary)' }}>
                      {thm.name}
                    </h3>
                    {thm.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-400 border border-teal-400/30">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleActivate(thm.id)}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white border border-transparent hover:border-white/10 transition"
                      >
                        Set Active
                      </button>
                    )}
                  </div>

                  {/* Visual Color Palette Swatch */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-black/20 border border-white/5 mb-3">
                    <div className="flex-1 text-center">
                      <div className="w-full h-6 rounded-lg mb-1 shadow-sm" style={{ backgroundColor: thm.accent }} />
                      <span className="text-[9px] font-mono text-gray-400">Accent</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-full h-6 rounded-lg mb-1 border border-white/10" style={{ backgroundColor: thm.bg_base }} />
                      <span className="text-[9px] font-mono text-gray-400">Base</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-full h-6 rounded-lg mb-1 border border-white/10" style={{ backgroundColor: thm.bg_surface }} />
                      <span className="text-[9px] font-mono text-gray-400">Card</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="w-full h-6 rounded-lg mb-1 border border-white/10" style={{ backgroundColor: thm.text_primary }} />
                      <span className="text-[9px] font-mono text-gray-400">Text</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={() => handleEdit(thm)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                    title="Edit Theme"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(thm.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                    title="Delete Theme"
                  >
                    <Trash2 className="w-4 h-4" />
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

export default ThemesManager;
