import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { 
  Edit2, 
  Trash2, 
  Plus, 
  X, 
  Code2, 
  Layers, 
  Sun, 
  Moon, 
  Sparkles, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import AppIcon from '../../components/icons/AppIcon';

const categoryLabels = {
  PROGRAMMING_LANGUAGE: 'Programming Languages',
  MARKUP_STYLING: 'Markup / Styling Languages',
  DATABASE: 'Databases',
  LIBRARY: 'Libraries & Frameworks',
  TOOL: 'Tools & DevOps',
  PLATFORM: 'Platforms & Cloud',
  TECHNOLOGY: 'Technologies',
  OTHER: 'Others'
};

const SkillsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [customIcons, setCustomIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'PROGRAMMING_LANGUAGE', 
    percentage: 80, 
    icon_name: '',
    icon_url: '',
    icon_type: 'light',
    is_featured: true
  });
  const [editingId, setEditingId] = useState(null);

  const fetchSkills = async () => {
    try {
      const [portfolioRes, iconsRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/admin/icons').catch(() => ({ data: [] }))
      ]);
      // Use allSkills if available so admin sees both visible and hidden skills
      setSkills(portfolioRes.data.allSkills || portfolioRes.data.skills || []);
      setCustomIcons(iconsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchSkills(); 
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      category: 'PROGRAMMING_LANGUAGE', 
      percentage: 80, 
      icon_name: '',
      icon_url: '',
      icon_type: 'light',
      is_featured: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/skills/${editingId}`, formData);
      } else {
        await api.post('/admin/skills', formData);
      }
      resetForm();
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert('Error saving skill.');
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage ?? 80,
      icon_name: skill.icon_name || '',
      icon_url: skill.icon_url || '',
      icon_type: skill.icon_type || 'light',
      is_featured: skill.is_featured !== false
    });

    // Auto-scroll directly to the form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 250);
  };

  const toggleVisibility = async (skill) => {
    const nextState = skill.is_featured === false ? true : false;
    setTogglingId(skill.id);

    // Optimistic state update
    setSkills((prev) =>
      prev.map((s) => (s.id === skill.id ? { ...s, is_featured: nextState } : s))
    );

    try {
      await api.put(`/admin/skills/${skill.id}`, { is_featured: nextState });
    } catch (err) {
      console.error('Error toggling skill visibility:', err);
      // Revert optimistic update on error
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, is_featured: !nextState } : s))
      );
      alert('Could not update visibility.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert('Error deleting skill.');
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const totalVisible = skills.filter((s) => s.is_featured !== false).length;
  const totalHidden = skills.length - totalVisible;

  return (
    <div className="space-y-8">
      {/* Skill Form Card */}
      <div 
        ref={formRef} 
        className={`admin-card p-5 sm:p-7 transition-all duration-300 ${
          editingId ? 'ring-2 ring-accent/60 shadow-lg' : ''
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                {editingId ? `Update Skill: ${formData.name || '...'}` : 'Add New Skill'}
                {editingId && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium">
                    Editing Mode
                  </span>
                )}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure technology name, icon, category, and homepage visibility.
              </p>
            </div>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="admin-btn-secondary text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="admin-label">Skill Name *</label>
              <input
                ref={nameInputRef}
                type="text"
                placeholder="e.g. TypeScript, React, Docker"
                className="admin-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Category *</label>
              <select
                className="admin-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="admin-label">Proficiency % (Stored in DB)</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="80"
                className="admin-input"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label mb-0">Custom Uploaded Icon</label>
                {customIcons.length > 0 && (
                  <span className="text-[10px] text-teal-400 font-medium">
                    {customIcons.length} available
                  </span>
                )}
              </div>
              <select
                className="admin-input"
                value={formData.icon_url || ''}
                onChange={(e) => {
                  const selectedUrl = e.target.value;
                  const found = customIcons.find((c) => c.url === selectedUrl);
                  setFormData({
                    ...formData,
                    icon_url: selectedUrl,
                    icon_type: found?.icon_type || formData.icon_type
                  });
                }}
              >
                <option value="">-- Choose custom uploaded icon --</option>
                {customIcons.map((ci) => (
                  <option key={ci.id} value={ci.url}>
                    {ci.name} ({ci.icon_type === 'dark' ? 'Dark' : 'Light'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label mb-0">Or SimpleIcon Slug</label>
              </div>
              <input
                type="text"
                placeholder="e.g. react, typescript, python, docker"
                className="admin-input font-mono text-xs"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                SimpleIcon slug (e.g. nodedotjs, postgresql, nextdotjs)
              </span>
            </div>

            <div>
              <label className="admin-label">Icon Visual Plate</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon_type: 'light' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    formData.icon_type === 'light'
                      ? 'border-teal-400 bg-teal-400/10 text-white'
                      : 'border-white/10 bg-slate-800/40 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Light / Normal
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, icon_type: 'dark' })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    formData.icon_type === 'dark'
                      ? 'border-teal-400 bg-teal-400/10 text-white'
                      : 'border-white/10 bg-slate-800/40 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> Dark Plate
                </button>
              </div>
            </div>

            <div>
              <label className="admin-label">Live Icon Preview</label>
              <div className="p-2.5 rounded-xl border border-white/10 bg-slate-900/90 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppIcon
                    iconUrl={formData.icon_url}
                    iconName={formData.icon_name}
                    iconType={formData.icon_type}
                    className="w-6 h-6 shrink-0"
                    alt={formData.name || 'skill'}
                  />
                  <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {formData.name || 'Skill preview'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-teal-400">
                  {formData.icon_type === 'dark' ? 'Dark Plate' : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Visibility Checkbox */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-600 bg-gray-700"
              />
              <div>
                <span className="text-xs sm:text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>
                  Show on Public Homepage
                </span>
                <span className="text-[11px] block" style={{ color: 'var(--text-secondary)' }}>
                  When enabled, this skill is featured in the public Skills & Expertise section.
                </span>
              </div>
            </label>
            <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold">
              {formData.is_featured ? (
                <span className="flex items-center gap-1 text-teal-400">
                  <Eye className="w-4 h-4" /> Visible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400">
                  <EyeOff className="w-4 h-4" /> Hidden
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Save Changes' : 'Add Skill'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skills Inventory Card with Short Cards */}
      <div className="admin-card p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              Skills Inventory
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-accent">
                {skills.length} Total
              </span>
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Click the eye icon to toggle public homepage visibility instantly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-400/10 border border-teal-400/30 text-teal-400 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> {totalVisible} Visible
            </span>
            {totalHidden > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5" /> {totalHidden} Hidden
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No skills cataloged yet. Add your primary tech stack above!
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSkills).map(([catKey, catSkills]) => (
              <div key={catKey} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--accent)' }}>
                    {categoryLabels[catKey] || catKey}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                    {catSkills.length}
                  </span>
                </div>

                {/* Short Compact Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {catSkills.map((skill) => {
                    const isVisible = skill.is_featured !== false;
                    const isCurrentlyEditing = editingId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className={`px-3 py-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all duration-200 group ${
                          isCurrentlyEditing 
                            ? 'ring-2 ring-accent border-accent bg-accent/10' 
                            : !isVisible 
                              ? 'border-white/5 bg-slate-900/40 opacity-70 hover:opacity-100' 
                              : 'border-white/10 hover:border-accent/40 bg-slate-800/40 hover:bg-slate-800/70'
                        }`}
                      >
                        {/* Left: Icon + Name */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/10 bg-black/25">
                            <AppIcon
                              iconUrl={skill.icon_url}
                              iconName={skill.icon_name}
                              iconType={skill.icon_type}
                              className="w-4 h-4"
                              alt={skill.name}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                                {skill.name}
                              </span>
                              {!isVisible && (
                                <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 block truncate">
                              {skill.percentage}% proficiency
                            </span>
                          </div>
                        </div>

                        {/* Right: Actions (Eye Toggle, Edit with auto-scroll, Delete) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Eye Toggle Option */}
                          <button
                            type="button"
                            onClick={() => toggleVisibility(skill)}
                            disabled={togglingId === skill.id}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isVisible
                                ? 'text-teal-400 border-teal-400/30 bg-teal-400/10 hover:bg-teal-400/20'
                                : 'text-gray-500 border-white/10 bg-white/5 hover:text-gray-300 hover:bg-white/10'
                            }`}
                            title={isVisible ? 'Visible on homepage (Click to hide)' : 'Hidden from homepage (Click to show)'}
                          >
                            {isVisible ? (
                              <Eye className="w-3.5 h-3.5 text-accent" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>

                          {/* Edit Icon with Auto Scroll */}
                          <button
                            type="button"
                            onClick={() => handleEdit(skill)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-white/10 border border-transparent hover:border-white/10 transition cursor-pointer"
                            title="Edit Skill (auto-scrolls to form)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Icon */}
                          <button
                            type="button"
                            onClick={() => handleDelete(skill.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
                            title="Delete Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
