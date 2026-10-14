import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { ImageUploader } from './ImageUploader';
import { UserCheck, Trash2, Check, Sparkles, Image as ImageIcon, Globe } from 'lucide-react';
import { MaleCoderAvatar } from '../../components/ui/MaleCoderAvatar';

const DEVELOPER_FONTS = [
  'JetBrains Mono',
  'Fira Code',
  'Geist Mono',
  'Space Mono',
  'Inter Sans',
];

export const ProfileManager: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ profile: any }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });

  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    faviconUrl: '',
    experienceYears: '',
    languages: '',
    nationality: '',
    resumeUrl: '',
    email: '',
    phone: '',
    location: '',
    availableForWork: true,
    fontFamily: 'JetBrains Mono',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setForm({
        name: data.profile.name || '',
        title: data.profile.title || '',
        bio: data.profile.bio || '',
        avatarUrl: data.profile.avatarUrl || '',
        faviconUrl: data.profile.faviconUrl || '',
        experienceYears: data.profile.experienceYears || '',
        languages: data.profile.languages || '',
        nationality: data.profile.nationality || '',
        resumeUrl: data.profile.resumeUrl || '',
        email: data.profile.email || '',
        phone: data.profile.phone || '',
        location: data.profile.location || '',
        availableForWork: data.profile.availableForWork !== false,
        fontFamily: data.profile.fontFamily || 'JetBrains Mono',
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: typeof form) =>
      apiClient('/profile', { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    },
  });

  if (isLoading) {
    return <div className="text-xs font-mono text-text-muted">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-accent" />
          <span>Profile & Bio Configuration</span>
        </h2>
        {savedSuccess && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Font & Availability */}
        <div className="space-y-4">
          {/* Avatar Picture */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase text-text-muted flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3 text-accent" />
                <span>Avatar Picture</span>
              </label>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-background border border-border text-text-muted">
                {form.avatarUrl ? 'Custom Image' : 'Default SVG'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-background flex-shrink-0">
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <MaleCoderAvatar className="w-full h-full object-cover" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <ImageUploader
                  label="Upload New Photo"
                  onUploadSuccess={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
                />
                {form.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, avatarUrl: '' }))}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset to SVG</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Favicon Configuration */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase text-text-muted flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-accent" />
                <span>Browser Favicon</span>
              </label>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-background border border-border text-text-muted">
                {form.faviconUrl ? 'Custom Icon' : 'Default SVG'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center flex-shrink-0 p-2 shadow-inner">
                {form.faviconUrl ? (
                  <img src={form.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                ) : (
                  <img src="/favicon.svg" alt="Default Favicon" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <ImageUploader
                  label="Upload Favicon (.ico, .png, .svg)"
                  onUploadSuccess={(url) => setForm((prev) => ({ ...prev, faviconUrl: url }))}
                />
                {form.faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, faviconUrl: '' }))}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Availability Status */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <label className="text-[10px] uppercase text-text-muted block">Availability Status</label>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-main">
                {form.availableForWork ? 'Available for work' : 'Not available'}
              </span>
              <input
                type="checkbox"
                checked={form.availableForWork}
                onChange={(e) => setForm((prev) => ({ ...prev, availableForWork: e.target.checked }))}
                className="rounded border-border cursor-pointer"
              />
            </div>
          </div>

          {/* Typography Preference */}
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <label className="text-[10px] uppercase text-text-muted flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Developer Font</span>
            </label>
            <select
              value={form.fontFamily}
              onChange={(e) => setForm((prev) => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent cursor-pointer"
            >
              {DEVELOPER_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Columns: Credentials & Bio Form */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-surface border border-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Professional Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-text-muted">Bio Writeup</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Experience Years</label>
              <input
                type="text"
                placeholder="e.g. 5+ Years"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Languages</label>
              <input
                type="text"
                placeholder="English, Bengali"
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Nationality</label>
              <input
                type="text"
                placeholder="Bangladeshi"
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-text-muted">Resume Download URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.resumeUrl}
              onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending}
              className="px-6 py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
