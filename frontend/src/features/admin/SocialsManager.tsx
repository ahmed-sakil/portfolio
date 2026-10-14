import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Share2, Plus, Trash2, Edit2, ExternalLink, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SocialLink {
  id: string;
  title: string;
  icon: string;
  link: string;
  showOnHero: boolean;
  order: number;
}

const COMMON_ICONS = [
  'Github',
  'Linkedin',
  'Twitter',
  'Instagram',
  'Youtube',
  'Facebook',
  'FileText',
  'Globe',
  'Mail',
  'Code',
  'Send',
  'MessageCircle',
];

export const SocialsManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: socials = [], isLoading } = useQuery<SocialLink[]>({
    queryKey: ['socials', 'all'],
    queryFn: () => apiClient<SocialLink[]>('/socials'),
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    icon: 'Github',
    link: '',
    showOnHero: true,
    order: 0,
  });

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) => {
      if (editingId) {
        return apiClient<SocialLink>(`/socials/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      }
      return apiClient<SocialLink>('/socials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/socials/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socials'] }),
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: '',
      icon: 'Github',
      link: '',
      showOnHero: true,
      order: socials.length + 1,
    });
  };

  const handleStartEdit = (s: SocialLink) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      icon: s.icon,
      link: s.link,
      showOnHero: s.showOnHero,
      order: s.order,
    });
  };

  const renderIconPreview = (name: string) => {
    const IconComp = (Icons as unknown as Record<string, LucideIcon>)[name] || ExternalLink;
    return <IconComp className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 font-mono">
          <Share2 className="w-4 h-4 text-accent" />
          <span>Social & External Links ({socials.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-1 p-6 rounded-lg bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-main">
              {editingId ? 'Edit Social Link' : 'Add New Link'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-xs text-text-muted hover:text-text-main font-mono">
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-text-muted">Platform Title</label>
              <input
                type="text"
                placeholder="e.g. GitHub, LinkedIn, Upwork, Twitter"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-text-muted">Target URL</label>
              <input
                type="url"
                placeholder="https://github.com/yourhandle"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-text-muted">Lucide Icon Name</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Github, Linkedin, Globe"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent font-mono"
                />
                <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                  {renderIconPreview(form.icon)}
                </div>
              </div>

              {/* Quick Pick Icon Chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
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

            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showOnHero}
                  onChange={(e) => setForm({ ...form, showOnHero: e.target.checked })}
                  className="rounded border-border"
                />
                <span>Show in Hero / Header</span>
              </label>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-mono uppercase text-text-muted">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.title || !form.link || saveMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity font-mono mt-3"
            >
              <Plus className="w-4 h-4" />
              <span>{editingId ? 'Update Social Link' : 'Save Social Link'}</span>
            </button>
          </div>
        </div>

        {/* Existing Links List */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-main">
              Active Social Links ({socials.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="text-xs font-mono text-text-muted">Loading social links...</div>
          ) : socials.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-background border border-border text-xs font-mono text-text-muted">
              No social links configured yet. Add your GitHub, LinkedIn, or personal handles above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {socials.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0">
                      {renderIconPreview(s.icon)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-main font-mono">{s.title}</span>
                        <span className="text-[10px] font-mono text-text-muted">#{s.order}</span>
                      </div>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-text-muted hover:text-accent truncate block"
                      >
                        {s.link}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono">
                      {s.showOnHero && (
                        <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted">
                          Hero
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(s)}
                        className="p-1.5 rounded border border-border text-text-muted hover:text-text-main transition-colors"
                        title="Edit link"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(s.id)}
                        className="p-1.5 rounded border border-border text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
