import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Theme } from '../../app/providers/ThemeProvider';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';

export const ThemeManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: themes = [], isLoading } = useQuery<Theme[]>({
    queryKey: ['themes'],
    queryFn: () => apiClient<Theme[]>('/themes'),
  });

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    bg: '#09090b',
    surface: '#121215',
    border: '#27272a',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    accent: '#10b981',
    isDefault: false,
  });

  const createMutation = useMutation({
    mutationFn: (newTheme: typeof formData) =>
      apiClient<Theme>('/themes', {
        method: 'POST',
        body: JSON.stringify(newTheme),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      setFormData({
        name: '',
        slug: '',
        bg: '#09090b',
        surface: '#121215',
        border: '#27272a',
        text: '#fafafa',
        textMuted: '#a1a1aa',
        accent: '#10b981',
        isDefault: false,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(`/themes/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (theme: Theme) =>
      apiClient(`/themes/${theme.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...theme, isDefault: true }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Themes ({themes.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Creator Form */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-main">
            Create New Theme
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-text-muted">Theme Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Cyber Charcoal"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-text-muted">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="cyber-charcoal"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Color Tokens Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {[
              { label: 'Background', key: 'bg' },
              { label: 'Surface', key: 'surface' },
              { label: 'Border', key: 'border' },
              { label: 'Text Main', key: 'text' },
              { label: 'Text Muted', key: 'textMuted' },
              { label: 'Accent', key: 'accent' },
            ].map(({ label, key }) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-text-muted">{label}</label>
                <div className="flex items-center gap-2 p-1.5 rounded-xl bg-background border border-border">
                  <input
                    type="color"
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full bg-transparent text-[11px] font-mono text-text-main focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview Card */}
          <div className="mt-4 p-4 rounded-xl border space-y-2 transition-all" style={{ backgroundColor: formData.surface, borderColor: formData.border }}>
            <div className="text-[10px] font-mono uppercase" style={{ color: formData.textMuted }}>Live Theme Preview</div>
            <div className="text-sm font-bold" style={{ color: formData.text }}>Sample Card Component</div>
            <p className="text-xs" style={{ color: formData.textMuted }}>This is how surfaces, hairlines, and typography look with these tokens.</p>
            <div className="pt-2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold" style={{ backgroundColor: formData.accent, color: formData.bg }}>
                Primary Accent
              </span>
            </div>
          </div>

          <button
            onClick={() => createMutation.mutate(formData)}
            disabled={!formData.name || !formData.slug || createMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-background font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>{createMutation.isPending ? 'Publishing...' : 'Publish Theme to Portfolio'}</span>
          </button>
        </div>

        {/* Existing Themes List */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-main">
            Active Published Themes ({themes.length})
          </h3>

          {isLoading ? (
            <div className="text-xs font-mono text-text-muted">Loading themes...</div>
          ) : (
            <div className="space-y-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: theme.bg }} title="BG" />
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: theme.surface }} title="Surface" />
                      <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: theme.accent }} title="Accent" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-text-main flex items-center gap-2">
                        <span>{theme.name}</span>
                        {theme.isDefault && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-accent">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">{theme.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!theme.isDefault && (
                      <button
                        onClick={() => setDefaultMutation.mutate(theme)}
                        className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface text-xs"
                        title="Set as Default Theme"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Delete theme "${theme.name}"?`)) {
                          deleteMutation.mutate(theme.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-border text-rose-400 hover:bg-rose-500/10 text-xs"
                      title="Delete Theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
