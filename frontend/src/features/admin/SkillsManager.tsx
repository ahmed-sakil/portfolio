import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Code2, Trash2, Edit2, FolderPlus, FolderGit2, X, Plus, Layers, CheckCircle2 } from 'lucide-react';
import { renderResolvedIcon } from '../../lib/iconResolver';
import { IconSelector } from './IconSelector';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  order: number;
}

interface SkillCategory {
  id: string;
  name: string;
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

const COMMON_CATEGORY_ICONS = [
  'Terminal',
  'Atom',
  'Database',
  'Cloud',
  'Server',
  'Cpu',
  'Layers',
  'Code2',
  'Globe',
  'Shield',
  'Sparkles',
  'FolderGit2',
];

export const SkillsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ skills?: Skill[]; skillCategories?: SkillCategory[] }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });

  const skills = data?.skills || [];
  const categories = data?.skillCategories || [];

  // Skill Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Programming Languages',
    icon: '',
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Category Management State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'Terminal',
    order: 0,
  });
  const [categoryError, setCategoryError] = useState('');

  // Map category by name for rapid metadata resolution
  const categoryMap = new Map<string, SkillCategory>();
  categories.forEach((c) => categoryMap.set(c.name, c));

  // Build sorted category names list
  const allCategoryNames = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...skills.map((s) => s.category),
    ])
  );

  const sortedCategoryNames = allCategoryNames.sort((a, b) => {
    const orderA = categoryMap.get(a)?.order ?? 999;
    const orderB = categoryMap.get(b)?.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b);
  });

  // Skill Mutations
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

  // Category Mutations
  const saveCategoryMutation = useMutation({
    mutationFn: async (payload: typeof categoryForm) => {
      if (editingCategory && editingCategory.id) {
        return apiClient<SkillCategory>(`/profile/skill-categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return apiClient<SkillCategory>('/profile/skill-categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (savedCat) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setForm((prev) => ({ ...prev, category: savedCat.name }));
      setEditingCategory(null);
      setCategoryForm({ name: '', icon: 'Terminal', order: categories.length + 1 });
      setCategoryError('');
    },
    onError: (err: any) => {
      setCategoryError(err.message || 'Failed to save skill category');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/profile/skill-categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (err: any) => {
      setCategoryError(err.message || 'Failed to delete category');
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: form.category || sortedCategoryNames[0] || 'Programming Languages',
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

  const handleStartNewCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      icon: 'Terminal',
      order: categories.length,
    });
    setCategoryError('');
    setShowCategoryModal(true);
  };

  const handleStartEditCategory = (cat: SkillCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      icon: cat.icon || 'Terminal',
      order: cat.order ?? 0,
    });
    setCategoryError('');
    setShowCategoryModal(true);
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-text-muted">Loading skills...</div>;
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Header with Title and Category Management Button */}
      <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-3">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Code2 className="w-4 h-4 text-accent" />
          <span>Skills & Technical Stack ({skills.length})</span>
        </h2>

        <button
          type="button"
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs text-text-main hover:border-accent transition-colors cursor-pointer shadow-xs"
        >
          <Layers className="w-3.5 h-3.5 text-accent" />
          <span>Manage Categories ({categories.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Form */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-main">
              {editingId ? 'Edit Skill' : 'Add Skill'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-text-muted hover:text-text-main cursor-pointer">
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
                  onClick={handleStartNewCategory}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FolderPlus className="w-3 h-3" />
                  <span>+ New Category</span>
                </button>
              </div>

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent cursor-pointer"
              >
                {sortedCategoryNames.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <IconSelector
              label="Skill Icon (Lucide / Upload / OpenSourceIcon Link)"
              value={form.icon}
              onChange={(val) => setForm({ ...form, icon: val })}
              presets={COMMON_SKILL_ICONS}
              fallbackIcon={<Code2 className="w-4 h-4 text-accent" />}
            />

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
              className="w-full py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-2 cursor-pointer"
            >
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </div>

        {/* List grouped by category */}
        <div className="lg:col-span-2 space-y-4">
          {sortedCategoryNames.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const categoryInfo = categoryMap.get(cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="p-4 rounded-xl bg-surface border border-border space-y-3">
                <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center text-accent p-1 overflow-hidden flex-shrink-0">
                      {renderResolvedIcon(
                        categoryInfo?.icon,
                        <FolderGit2 className="w-3.5 h-3.5 text-accent" />,
                        "w-3.5 h-3.5 text-accent",
                        "w-full h-full object-contain p-0"
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-wider truncate">{cat}</h4>
                      <span className="text-[10px] text-text-muted block">
                        {catSkills.length} skills • Order: {categoryInfo?.order ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleStartEditCategory(
                          categoryInfo || {
                            id: '',
                            name: cat,
                            icon: 'Terminal',
                            order: 0,
                          }
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-background border border-border text-[10px] text-text-muted hover:text-text-main hover:border-accent/40 transition-colors cursor-pointer"
                      title="Edit Category Name & Icon"
                    >
                      <Edit2 className="w-3 h-3 text-accent" />
                      <span>Edit Category</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catSkills.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center flex-shrink-0 p-0.5 overflow-hidden">
                          {renderResolvedIcon(s.icon, <Code2 className="w-3 h-3 text-accent" />, "w-3 h-3 text-accent", "w-full h-full object-contain")}
                        </div>
                        <span className="font-semibold text-text-main truncate">{s.name}</span>
                        <span className="text-[9px] text-text-muted">#{s.order}</span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(s)}
                          className="p-1 rounded text-text-muted hover:text-text-main cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(s.id)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
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

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">
                  Skill Category Management
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Form */}
            <div className="p-4 rounded-xl bg-background border border-border space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : '+ Add New Category'}
                </span>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', icon: 'Terminal', order: categories.length });
                    }}
                    className="text-[10px] text-text-muted hover:text-text-main cursor-pointer"
                  >
                    Switch to Add New
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Category Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Engineering, DevOps & Infrastructure"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>

              <IconSelector
                label="Category Icon (shown on homepage beside header)"
                value={categoryForm.icon}
                onChange={(val) => setCategoryForm((prev) => ({ ...prev, icon: val }))}
                presets={COMMON_CATEGORY_ICONS}
                fallbackIcon={<FolderGit2 className="w-4 h-4 text-accent" />}
              />

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Display Order (lowest rendered first)</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-xs text-text-main focus:outline-none"
                />
              </div>

              {categoryError && (
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {categoryError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={!categoryForm.name.trim() || saveCategoryMutation.isPending}
                  onClick={() => saveCategoryMutation.mutate(categoryForm)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-xs"
                >
                  {saveCategoryMutation.isPending ? (
                    <span>Saving...</span>
                  ) : editingCategory ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Update Category</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Registered Categories */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">
                Existing Categories ({categories.length})
              </h4>

              {categories.length === 0 ? (
                <p className="text-xs text-text-muted italic">No categories registered yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const skillCount = skills.filter((s) => s.category === cat.name).length;
                    const isSelected = editingCategory?.id === cat.id;

                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                          isSelected
                            ? 'bg-accent/10 border-accent/40'
                            : 'bg-background border border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center p-1 overflow-hidden flex-shrink-0 text-accent">
                            {renderResolvedIcon(
                              cat.icon,
                              <FolderGit2 className="w-4 h-4 text-accent" />,
                              "w-4 h-4 text-accent",
                              "w-full h-full object-contain p-0"
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-text-main block truncate">{cat.name}</span>
                            <span className="text-[10px] text-text-muted">
                              Order: {cat.order} • {skillCount} skills
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(cat)}
                            className="p-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={deleteCategoryMutation.isPending}
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete category "${cat.name}"? Existing skills in this category will remain, but the category metadata will be removed.`
                                )
                              ) {
                                deleteCategoryMutation.mutate(cat.id);
                              }
                            }}
                            className="p-1.5 rounded-md border border-border bg-surface hover:bg-rose-500/10 text-rose-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
