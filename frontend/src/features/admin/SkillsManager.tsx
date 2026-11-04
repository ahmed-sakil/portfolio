import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Code2, Trash2, Edit2, FolderPlus } from 'lucide-react';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  order: number;
}

const COMMON_SKILL_ICONS = [
  'Atom',
  'Code2',
  'Database',
  'Server',
  'Terminal',
  'Cpu',
  'Layers',
  'Sparkles',
  'Globe',
  'Box',
  'Cloud',
  'Shield',
];

export const SkillsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ skills: Skill[] }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });
  const skills = data?.skills || [];

  const [form, setForm] = useState({
    name: '',
    category: 'Programming Languages',
    icon: '',
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);

  const existingCategories = Array.from(
    new Set([
      'Programming Languages',
      'Frameworks & Libraries',
      'Databases & Caching',
      'Cloud & DevOps',
      ...skills.map((s) => s.category),
    ])
  );

  const saveMutation = useMutation({
    mutationFn: (payload: typeof form) => {
      if (editingId) {
        return apiClient(`/profile/skills/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return apiClient('/profile/skills', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/profile/skills/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: form.category || 'Programming Languages',
      icon: '',
      order: skills.length,
    });
  };

  const handleStartEdit = (s: Skill) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      icon: s.icon || '',
      order: s.order,
    });
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      setForm((prev) => ({ ...prev, category: newCategoryName.trim() }));
      setNewCategoryName('');
      setShowNewCatInput(false);
    }
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-text-muted">Loading skills...</div>;
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Code2 className="w-4 h-4 text-accent" />
          <span>Skills & Technical Stack ({skills.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-main">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-text-muted hover:text-text-main">
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. TypeScript, React, PostgreSQL"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-text-muted">Category</label>
                <button
                  type="button"
                  onClick={() => setShowNewCatInput(!showNewCatInput)}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1"
                >
                  <FolderPlus className="w-3 h-3" />
                  <span>+ New Category</span>
                </button>
              </div>

              {showNewCatInput && (
                <div className="flex gap-2 pb-1">
                  <input
                    type="text"
                    placeholder="Category title..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-2.5 py-1 rounded bg-accent text-background font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              )}

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent cursor-pointer"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Icon Name or Image URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Atom, Database, Terminal"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                  {renderResolvedIcon(form.icon, <Code2 className="w-3.5 h-3.5 text-accent" />)}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_SKILL_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                      form.icon === ic
                        ? 'bg-accent text-background font-bold border-accent'
                        : 'bg-background border-border text-text-muted hover:text-text-main'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
              />
            </div>

            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.name || saveMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </div>

        {/* List grouped by category */}
        <div className="lg:col-span-2 space-y-4">
          {existingCategories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <div key={cat} className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-wider">{cat}</h4>
                  <span className="text-[10px] text-text-muted">{catSkills.length} skills</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center flex-shrink-0">
                          {renderResolvedIcon(s.icon, <Code2 className="w-3 h-3 text-accent" />)}
                        </div>
                        <span className="font-semibold text-text-main truncate">{s.name}</span>
                        <span className="text-[9px] text-text-muted">#{s.order}</span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(s)}
                          className="p-1 rounded text-text-muted hover:text-text-main"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(s.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
