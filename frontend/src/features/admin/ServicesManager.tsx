import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Zap, Trash2, Edit2, Layers } from 'lucide-react';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface SpecializedService {
  id: string;
  title: string;
  icon?: string | null;
  order: number;
}

const COMMON_SERVICE_ICONS = [
  'Layers',
  'Server',
  'Smartphone',
  'Code2',
  'Cloud',
  'Cpu',
  'Database',
  'Sparkles',
  'Shield',
  'Terminal',
];

export const ServicesManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ services: SpecializedService[] }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });
  const services = data?.services || [];

  const [form, setForm] = useState({
    title: '',
    icon: 'Layers',
    order: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: (s: typeof form) => {
      if (editingId) {
        return apiClient(`/profile/services/${editingId}`, { method: 'PUT', body: JSON.stringify(s) });
      }
      return apiClient('/profile/services', { method: 'POST', body: JSON.stringify(s) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/profile/services/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      icon: 'Layers',
      order: services.length,
    });
  };

  const handleStartEdit = (s: SpecializedService) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      icon: s.icon || 'Layers',
      order: s.order,
    });
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-text-muted">Loading services...</div>;
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span>Specialized Services ({services.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase text-text-main">
              {editingId ? 'Edit Service' : 'Add Service'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-text-muted hover:text-text-main">
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Offering Title</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web Engineering"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Icon Name or Image URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Layers, Server, Cloud"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
                <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                  {renderResolvedIcon(form.icon, <Layers className="w-4 h-4 text-accent" />)}
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_SERVICE_ICONS.map((ic) => (
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
              disabled={!form.title || saveMutation.isPending}
              className="w-full py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
            >
              {editingId ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-2.5">
          {services.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface border border-border text-xs text-text-muted">
              No specialized services registered.
            </div>
          ) : (
            services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-border gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                    {renderResolvedIcon(s.icon, <Layers className="w-4 h-4 text-accent" />)}
                  </div>
                  <div>
                    <span className="font-bold text-text-main block truncate">{s.title}</span>
                    <span className="text-[10px] text-text-muted">#{s.order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleStartEdit(s)}
                    className="p-1.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-main"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(s.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
