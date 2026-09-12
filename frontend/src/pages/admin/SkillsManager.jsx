import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Edit2, Trash2, Plus, X, Code2, Layers, Sun, Moon, Sparkles, Image as ImageIcon } from 'lucide-react';
import AppIcon from '../../components/icons/AppIcon';

const SkillsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [customIcons, setCustomIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'PROGRAMMING_LANGUAGE', 
    percentage: '', 
    icon_name: '',
    icon_url: '',
    icon_type: 'light'
  });
  const [editingId, setEditingId] = useState(null);

  const fetchSkills = async () => {
    try {
      const [portfolioRes, iconsRes] = await Promise.all([
        api.get('/portfolio'),
        api.get('/admin/icons').catch(() => ({ data: [] }))
      ]);
      setSkills(portfolioRes.data.skills || []);
      setCustomIcons(iconsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      category: 'PROGRAMMING_LANGUAGE', 
      percentage: '', 
      icon_name: '',
      icon_url: '',
      icon_type: 'light'
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
      percentage: skill.percentage,
      icon_name: skill.icon_name || '',
      icon_url: skill.icon_url || '',
      icon_type: skill.icon_type || 'light'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Skill Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Update Skill' : 'Add New Skill'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Highlight programming languages, libraries, tools, and platforms.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="admin-label">Skill Name *</label>
              <input
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
              <label className="admin-label">Proficiency % (0 - 100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="85"
                className="admin-input"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label mb-0">Select from Uploaded Icons</label>
                {customIcons.length > 0 && (
                  <span className="text-[10px] text-teal-400 font-medium">
                    {customIcons.length} in library
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label mb-0">Or SimpleIcon Slug / Name</label>
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
              <label className="admin-label">Icon Visual Type</label>
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
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Light / Color
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
                  <Moon className="w-3.5 h-3.5 text-cyan-400" /> Dark (Highlighted)
                </button>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Dark icons get a light contrast plate so they pop on dark UI
              </span>
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

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
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

      {/* Skills Inventory Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Skills Inventory ({skills.length})
          </h2>
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
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([catKey, catSkills]) => (
              <div key={catKey} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--accent)' }}>
                    {categoryLabels[catKey] || catKey}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                    {catSkills.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                      style={{
                        background: 'var(--bg-surface-hover)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <AppIcon
                              iconUrl={skill.icon_url}
                              iconName={skill.icon_name}
                              iconType={skill.icon_type}
                              className="w-5 h-5 shrink-0"
                              alt={skill.name}
                            />
                            <span className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold shrink-0 ml-2" style={{ color: 'var(--accent)' }}>
                            {skill.percentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${skill.percentage}%`,
                              background: 'var(--accent)'
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                          title="Delete Skill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
