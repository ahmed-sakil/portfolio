import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Edit2, Trash2, Plus, X, Code2, Layers } from 'lucide-react';

const SkillsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', category: 'PROGRAMMING_LANGUAGE', percentage: '', icon_name: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/portfolio');
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'PROGRAMMING_LANGUAGE', percentage: '', icon_name: '' });
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
      icon_name: skill.icon_name || ''
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
                <label className="admin-label mb-0">Icon Name</label>
                {formData.icon_name && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-400">
                    <img
                      src={`https://cdn.simpleicons.org/${formData.icon_name}`}
                      alt="icon"
                      className="w-3.5 h-3.5 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    Preview
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. react, typescript, python"
                className="admin-input"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                SimpleIcon slug (e.g. nodedotjs, postgresql)
              </span>
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
                            {skill.icon_name ? (
                              <img
                                src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                                alt={skill.name}
                                className="w-4 h-4 object-contain shrink-0"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[9px] text-teal-400 font-bold shrink-0">
                                {skill.name.charAt(0)}
                              </div>
                            )}
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
