import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Palette, Plus, Edit2, Trash2, CheckCircle2, Sparkles, Check, Eye, Code, Radio, Star } from 'lucide-react';
import { isColorLight } from '../../utils/themeEngine';

const PRESET_THEMES = [
  {
    name: 'Dark (Default)',
    accent: '#00e5a0',
    bg_base: '#0a0f1e',
    bg_surface: 'rgba(15, 23, 42, 0.88)',
    text_primary: '#f8fafc',
    bg_type: 'NEURON',
    flat_bg_code: '',
  },
  {
    name: 'Light (Default)',
    accent: '#0d9488',
    bg_base: '#f8fafc',
    bg_surface: 'rgba(255, 255, 255, 0.90)',
    text_primary: '#0f172a',
    bg_type: 'NEURON',
    flat_bg_code: '',
  },
  {
    name: 'Cyberpunk Violet',
    accent: '#a855f7',
    bg_base: '#0d0714',
    bg_surface: 'rgba(28, 15, 43, 0.88)',
    text_primary: '#f5f3ff',
    bg_type: 'NEURON',
    flat_bg_code: '',
  },
  {
    name: 'Ocean Cyan',
    accent: '#06b6d4',
    bg_base: '#03131e',
    bg_surface: 'rgba(8, 35, 54, 0.88)',
    text_primary: '#ecfeff',
    bg_type: 'NEURON',
    flat_bg_code: '',
  },
  {
    name: 'Obsidian Amber (Flat)',
    accent: '#f59e0b',
    bg_base: '#0b0c10',
    bg_surface: 'rgba(20, 22, 30, 0.90)',
    text_primary: '#f9fafb',
    bg_type: 'FLAT',
    flat_bg_code: 'linear-gradient(145deg, #0b0c10 0%, #161922 100%)',
  },
  {
    name: 'Deep Space Gradient (Flat)',
    accent: '#38bdf8',
    bg_base: '#030712',
    bg_surface: 'rgba(17, 24, 39, 0.88)',
    text_primary: '#f9fafb',
    bg_type: 'FLAT',
    flat_bg_code: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #030712 75%)',
  }
];

const SAMPLE_FLAT_CODES = [
  {
    label: 'Deep Space Gradient',
    code: 'radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #030712 75%)',
  },
  {
    label: 'Midnight Dual Tone',
    code: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
  },
  {
    label: 'Emerald Obsidian Mesh',
    code: 'radial-gradient(circle at 10% 20%, rgba(0, 229, 160, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 40%), #0a0f1e',
  },
  {
    label: 'Minimal Solid Noir',
    code: '#080c14',
  },
  {
    label: 'Light Porcelain Frost',
    code: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
];

const ThemesManager = () => {
  const token = useAuthStore((state) => state.token);
  const setCustomTheme = useThemeStore((state) => state.setCustomTheme);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    accent: '#00e5a0',
    bg_base: '#0a0f1e',
    bg_surface: 'rgba(15, 23, 42, 0.88)',
    text_primary: '#f8fafc',
    bg_type: 'NEURON',
    flat_bg_code: '',
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
      bg_surface: 'rgba(15, 23, 42, 0.88)',
      text_primary: '#f8fafc',
      bg_type: 'NEURON',
      flat_bg_code: '',
      is_active: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedTheme = null;
      if (editingId) {
        const res = await api.put(`/admin/themes/${editingId}`, formData);
        savedTheme = res.data;
      } else {
        const res = await api.post('/admin/themes', formData);
        savedTheme = res.data;
      }
      if (formData.is_active && savedTheme) {
        setCustomTheme(savedTheme);
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
      bg_type: theme.bg_type || 'NEURON',
      flat_bg_code: theme.flat_bg_code || '',
      is_active: theme.is_active,
    });
  };

  const handleActivate = async (id) => {
    try {
      const res = await api.patch(`/admin/themes/${id}/activate`, {});
      if (res.data) {
        setCustomTheme(res.data);
      }
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
      bg_type: preset.bg_type || 'NEURON',
      flat_bg_code: preset.flat_bg_code || '',
    });
  };

  const handlePreviewCurrent = () => {
    setCustomTheme(formData);
  };

  const previewInvertedText = isColorLight(formData.accent) ? '#0a0f1e' : '#ffffff';

  return (
    <div className="space-y-8">
      {/* Create / Edit Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-accent/30 bg-accent/10 text-accent">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Theme' : 'Theme Studio & 4-Color Engine'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure the centralized 4-color palette, background engine (Neuron vs Custom Flat CSS), and live preview.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePreviewCurrent}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-black transition flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Apply Live Preview Now</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 p-4 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-xs font-semibold block mb-2.5" style={{ color: 'var(--text-secondary)' }}>
            Quick Designer Presets (1-Click Fill):
          </span>
          <div className="flex flex-wrap gap-2.5">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-accent/50 flex items-center gap-2 transition cursor-pointer"
                style={{ background: 'var(--bg-surface-hover)' }}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: preset.accent }} />
                <span>{preset.name}</span>
                {preset.bg_type === 'FLAT' && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">FLAT</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Form and Live Preview Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
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

            {/* The 4 Core Colors */}
            <div className="p-4 rounded-2xl border space-y-4" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <span className="text-xs font-bold uppercase tracking-wider block text-accent">
                The 4 Centralized Theme Colors
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Accent */}
                <div>
                  <label className="admin-label text-xs">1. Accent Color (Interactive Brand)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
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

                {/* 2. Base Background */}
                <div>
                  <label className="admin-label text-xs">2. Base Background Color (Body/Canvas)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
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

                {/* 3. Surface / Card */}
                <div>
                  <label className="admin-label text-xs">3. Card / Surface Color (Glass / Panels)</label>
                  <input
                    type="text"
                    placeholder="rgba(15, 23, 42, 0.88)"
                    required
                    className="admin-input font-mono text-xs"
                    value={formData.bg_surface}
                    onChange={(e) => setFormData({ ...formData, bg_surface: e.target.value })}
                  />
                </div>

                {/* 4. Primary Text */}
                <div>
                  <label className="admin-label text-xs">4. Primary Text Color (Headings/Titles)</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
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
            </div>

            {/* Background Engine Mode Switcher */}
            <div className="p-4 rounded-2xl border space-y-3" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}>
              <label className="admin-label text-xs font-bold uppercase tracking-wider text-accent block">
                Global Background Mode
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${formData.bg_type === 'NEURON' ? 'border-accent bg-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <input
                    type="radio"
                    name="bg_type"
                    value="NEURON"
                    checked={formData.bg_type === 'NEURON'}
                    onChange={() => setFormData({ ...formData, bg_type: 'NEURON' })}
                    className="w-4 h-4 text-accent"
                  />
                  <div>
                    <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                      Interactive Neuron Canvas
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      Connected node mesh avoiding cursor
                    </span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition ${formData.bg_type === 'FLAT' ? 'border-accent bg-accent/10' : 'border-white/10 hover:bg-white/5'}`}>
                  <input
                    type="radio"
                    name="bg_type"
                    value="FLAT"
                    checked={formData.bg_type === 'FLAT'}
                    onChange={() => setFormData({ ...formData, bg_type: 'FLAT' })}
                    className="w-4 h-4 text-accent"
                  />
                  <div>
                    <span className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>
                      Custom Flat / CSS Background
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                      Turns off neuron; uses custom CSS code
                    </span>
                  </div>
                </label>
              </div>

              {/* Code input if FLAT background is selected */}
              {formData.bg_type === 'FLAT' && (
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Paste Flat Background Code (CSS background property):
                    </label>
                  </div>
                  
                  <textarea
                    rows={3}
                    placeholder="linear-gradient(135deg, #0f172a 0%, #020617 100%)"
                    className="admin-input font-mono text-xs leading-relaxed"
                    value={formData.flat_bg_code}
                    onChange={(e) => setFormData({ ...formData, flat_bg_code: e.target.value })}
                  />

                  {/* Sample Snippet Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-gray-400 self-center mr-1">Insert Sample:</span>
                    {SAMPLE_FLAT_CODES.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, flat_bg_code: sample.code })}
                        className="text-[10px] px-2 py-0.5 rounded border border-white/10 hover:border-accent/40 bg-white/5 text-gray-300 hover:text-white transition cursor-pointer"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-accent focus:ring-accent"
              />
              <label htmlFor="is_active" className="text-sm font-semibold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                Set as Active Theme Immediately
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <button type="submit" className="admin-btn-primary cursor-pointer">
                <Plus className="w-4 h-4 mr-1.5" />
                {editingId ? 'Update Theme' : 'Save Theme to Database'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="admin-btn-secondary cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Right Column: Real-Time Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider block text-accent">
              Real-Time Live Preview
            </span>

            <div
              className="p-6 rounded-2xl border transition-all duration-300 shadow-2xl relative overflow-hidden"
              style={{
                background: formData.bg_type === 'FLAT' && formData.flat_bg_code ? formData.flat_bg_code : formData.bg_base,
                borderColor: 'var(--border-subtle)',
              }}
            >
              {/* Background badge */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${formData.accent}20`,
                    borderColor: `${formData.accent}50`,
                    color: formData.accent,
                  }}
                >
                  {formData.bg_type === 'FLAT' ? 'Flat CSS Background' : 'Neuron Canvas Active'}
                </span>
                <span className="text-[10px] font-mono" style={{ color: formData.text_primary, opacity: 0.6 }}>
                  Theme Preview
                </span>
              </div>

              {/* Card Surface Preview */}
              <div
                className="p-5 rounded-xl border backdrop-blur-xl transition-all"
                style={{
                  background: formData.bg_surface,
                  borderColor: `${formData.text_primary}18`,
                  color: formData.text_primary,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: formData.accent }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: formData.accent }}>
                    Full Stack Developer
                  </span>
                </div>

                <h3 className="text-lg font-black tracking-tight mb-2" style={{ color: formData.text_primary }}>
                  {formData.name || 'Sample Theme Title'}
                </h3>

                <p className="text-xs leading-relaxed mb-4" style={{ color: formData.text_primary, opacity: 0.7 }}>
                  This card showcases how your 4 colors harmonize across surfaces, text, buttons, and borders.
                </p>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition"
                    style={{
                      backgroundColor: formData.accent,
                      color: previewInvertedText,
                    }}
                  >
                    Primary Button
                  </button>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                    style={{
                      borderColor: `${formData.text_primary}25`,
                      color: formData.text_primary,
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-accent/40 transition-all relative overflow-hidden"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: thm.is_active ? 'var(--accent)' : 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      {thm.name}
                    </h3>
                    {thm.is_active ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_var(--accent-glow)]"
                        title="Default primary theme for all visitors"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" /> Primary (All Visitors)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleActivate(thm.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/15 hover:border-accent hover:text-accent bg-white/5 hover:bg-white/10 transition cursor-pointer"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Set this theme as the primary default for all visitors"
                      >
                        <Star className="w-3 h-3" /> Make Primary (All Visitors)
                      </button>
                    )}
                  </div>

                  {/* Mode tag */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/5 text-gray-300">
                      Mode: {thm.bg_type === 'FLAT' ? 'Flat Custom CSS' : 'Interactive Neuron'}
                    </span>
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

                <div className="flex items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    type="button"
                    onClick={() => setCustomTheme(thm)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-white/10 hover:border-accent hover:text-accent transition cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Preview theme in current browser session"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(thm)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-accent transition cursor-pointer"
                      title="Edit Theme"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(thm.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition cursor-pointer"
                      title="Delete Theme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
