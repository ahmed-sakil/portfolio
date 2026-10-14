import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Project, Author } from '../projects/ProjectCard';
import { ImageUploader } from './ImageUploader';
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Users,
  Eye,
  Code,
  FolderGit2,
} from 'lucide-react';
import { renderResolvedIcon } from '../../lib/iconResolver';

const CATEGORY_PRESETS = [
  'Full Stack Web App',
  'Android App',
  'Mobile Application',
  'AI & Machine Learning',
  'DevOps & Cloud Architecture',
  'Open Source Library',
  'CLI & System Tooling',
];

const COMMON_PROJECT_ICONS = [
  'FolderGit2',
  'Smartphone',
  'Globe',
  'Database',
  'Server',
  'Cpu',
  'Layers',
  'Sparkles',
  'Terminal',
  'Code2',
  'Shield',
  'Cloud',
];

interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  icon: string;
  summary: string;
  caseStudy: string;
  descriptionMarkdown: string;
  thumbnail: string;
  screenshots: string[];
  liveUrl: string;
  githubUrl: string;
  tags: string[];
  level: string;
  projectType: string;
  isFeatured: boolean;
  featuredPriority: number;
  order: number;
  authorIds: string[];
}

export const ProjectManager: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => apiClient<Project[]>('/projects'),
  });

  // 2. Fetch skills for tech stack dropdown
  const { data: profileOverview } = useQuery<{ skills?: Array<{ id: string; name: string; category: string }> }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });
  const profileSkills = profileOverview?.skills || [];

  // 3. Fetch pre-available authors from database
  const { data: authors = [] } = useQuery<Author[]>({
    queryKey: ['authors'],
    queryFn: () => apiClient<Author[]>('/authors'),
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    category: 'Full Stack Web App',
    icon: 'FolderGit2',
    summary: '',
    caseStudy: '',
    descriptionMarkdown: '',
    thumbnail: '',
    screenshots: [],
    liveUrl: '',
    githubUrl: '',
    tags: [],
    level: 'Intermediate',
    projectType: 'Personal Project',
    isFeatured: false,
    featuredPriority: 0,
    order: 0,
    authorIds: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [activeCaseStudyTab, setActiveCaseStudyTab] = useState<'editor' | 'preview'>('editor');
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', icon: 'User', portfolioUrl: '' });

  // Save Project Mutation
  const saveMutation = useMutation({
    mutationFn: (data: ProjectFormData) => {
      const payload = {
        ...data,
        screenshots: data.screenshots,
        galleryUrls: data.screenshots,
      };
      if (isEditing) {
        return apiClient<Project>(`/projects/${isEditing}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      return apiClient<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
    },
  });

  // Delete Project Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  // Create Author Inline Mutation
  const createAuthorMutation = useMutation({
    mutationFn: (data: typeof newAuthor) =>
      apiClient<Author>('/authors', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      setFormData((prev) => ({
        ...prev,
        authorIds: [...prev.authorIds, created.id],
      }));
      setNewAuthor({ name: '', icon: 'User', portfolioUrl: '' });
      setShowAuthorModal(false);
    },
  });

  // Delete Author Mutation
  const deleteAuthorMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/authors/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authors'] }),
  });

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Full Stack Web App',
      icon: 'FolderGit2',
      summary: '',
      caseStudy: '',
      descriptionMarkdown: '',
      thumbnail: '',
      screenshots: [],
      liveUrl: '',
      githubUrl: '',
      tags: [],
      level: 'Intermediate',
      projectType: 'Personal Project',
      isFeatured: false,
      featuredPriority: 0,
      order: projects.length,
      authorIds: [],
    });
    setTagInput('');
    setActiveCaseStudyTab('editor');
  };

  const handleStartEdit = (p: Project) => {
    setIsEditing(p.id);
    const existingScreenshots = p.screenshots && p.screenshots.length > 0
      ? p.screenshots
      : (p.galleryUrls && p.galleryUrls.length > 0 ? p.galleryUrls : []);

    const existingAuthorIds = p.authors ? p.authors.map((a) => a.id) : [];

    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'Full Stack Web App',
      icon: p.icon || 'FolderGit2',
      summary: p.summary || '',
      caseStudy: p.caseStudy || p.descriptionMarkdown || '',
      descriptionMarkdown: p.descriptionMarkdown || '',
      thumbnail: p.thumbnail || '',
      screenshots: existingScreenshots,
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      tags: p.tags || [],
      level: p.level || 'Intermediate',
      projectType: p.projectType || 'Personal Project',
      isFeatured: p.isFeatured || false,
      featuredPriority: p.featuredPriority || 0,
      order: p.order || 0,
      authorIds: existingAuthorIds,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const toggleAuthorSelection = (authorId: string) => {
    setFormData((prev) => {
      const exists = prev.authorIds.includes(authorId);
      return {
        ...prev,
        authorIds: exists
          ? prev.authorIds.filter((id) => id !== authorId)
          : [...prev.authorIds, authorId],
      };
    });
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-accent" />
          <span>Projects ({projects.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-main">
              {isEditing ? 'Edit Project Deployment' : 'Create New Project'}
            </h3>
            {isEditing && (
              <button onClick={resetForm} className="text-xs text-text-muted hover:text-text-main">
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {/* Title & Slug */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  setFormData((prev) => ({ ...prev, title, slug: isEditing ? prev.slug : slug }));
                }}
                placeholder="e.g. NextGen Microservices Platform"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Category</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. Full Stack Web App, Android App"
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {CATEGORY_PRESETS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      formData.category === cat
                        ? 'bg-accent text-background font-bold border-accent'
                        : 'bg-background border-border text-text-muted hover:text-text-main'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Icon */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Project Icon (Lucide Name or Image URL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g. FolderGit2, Smartphone, Globe"
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
                <div className="w-9 h-9 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                  {renderResolvedIcon(formData.icon, <FolderGit2 className="w-4 h-4 text-accent" />)}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_PROJECT_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon: ic }))}
                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                      formData.icon === ic
                        ? 'bg-accent text-background font-bold border-accent'
                        : 'bg-background border-border text-text-muted hover:text-text-main'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Level & Project Type Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Proficiency Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Project Type</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="Personal Project">Personal Project</option>
                  <option value="Group Project">Group Project</option>
                </select>
              </div>
            </div>

            {/* Summary / Overview */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-text-muted">Project Overview (Summary)</label>
              <textarea
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief summary shown on cards and overview section..."
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Cloudinary Thumbnail */}
            <div className="space-y-1">
              <ImageUploader
                label="Thumbnail Image (Cloudinary or Direct URL)"
                onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
              />
              <input
                type="text"
                placeholder="Or paste image URL directly..."
                value={formData.thumbnail}
                onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
              />
              {formData.thumbnail && (
                <div className="relative rounded-lg overflow-hidden border border-border aspect-video bg-background mt-1">
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, thumbnail: '' }))}
                    className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-rose-400 hover:text-rose-300 text-[10px]"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Multiple Screenshots */}
            <div className="p-3.5 rounded-lg bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-text-muted">
                  Project Screenshots ({formData.screenshots.length})
                </label>
              </div>

              <ImageUploader
                label="Upload Screenshot"
                onUploadSuccess={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    screenshots: [...prev.screenshots, url],
                  }))
                }
              />

              {formData.screenshots.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                  {formData.screenshots.map((url, idx) => (
                    <div key={idx} className="relative group rounded-md overflow-hidden border border-border aspect-video bg-surface">
                      <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            screenshots: prev.screenshots.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-rose-600/90 text-white text-[10px] hover:bg-rose-700 transition-colors"
                        title="Delete screenshot"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Details and Case Study (HTML Editor with Live Preview) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-text-muted">
                  Case Study & Architecture (HTML Code)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudyTab('editor')}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
                      activeCaseStudyTab === 'editor'
                        ? 'bg-accent text-background font-bold'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Code className="w-3 h-3" />
                    <span>Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCaseStudyTab('preview')}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
                      activeCaseStudyTab === 'preview'
                        ? 'bg-accent text-background font-bold'
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {activeCaseStudyTab === 'editor' ? (
                <textarea
                  rows={5}
                  value={formData.caseStudy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseStudy: e.target.value }))}
                  placeholder="<h3>Architecture Highlights</h3><p>Implemented distributed caching with Redis and event bus...</p><ul><li>99.99% Uptime</li></ul>"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent resize-none font-mono"
                />
              ) : (
                <div
                  className="p-3.5 rounded-lg bg-background border border-border text-xs text-text-muted min-h-[120px] max-h-48 overflow-y-auto space-y-2 [&>h1]:text-sm [&>h1]:font-bold [&>h1]:text-accent [&>h2]:text-xs [&>h2]:font-bold [&>h2]:text-text-main [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-accent [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>code]:bg-surface [&>code]:px-1 [&>code]:text-accent"
                  dangerouslySetInnerHTML={{
                    __html: formData.caseStudy || '<p className="text-text-muted italic">No HTML content yet. Type in the code editor to see live preview.</p>',
                  }}
                />
              )}
            </div>

            {/* Links (Live URL, GitHub URL) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Live App URL (Optional)</label>
                <input
                  type="text"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))}
                  placeholder="https://app.domain.com"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">GitHub URL (Optional)</label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Authors & Contributors */}
            <div className="space-y-2 p-3.5 rounded-lg bg-background border border-border">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-text-muted flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-accent" />
                  <span>Authors & Contributors ({formData.authorIds.length} Selected)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAuthorModal(!showAuthorModal)}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Author</span>
                </button>
              </div>

              {/* Inline Add New Author Form */}
              {showAuthorModal && (
                <div className="p-3 rounded-lg bg-surface border border-accent/40 space-y-2">
                  <span className="text-[10px] text-accent font-bold uppercase block">Create Author</span>
                  <input
                    type="text"
                    placeholder="Author Full Name *"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Icon (e.g. User, Github)"
                      value={newAuthor.icon}
                      onChange={(e) => setNewAuthor({ ...newAuthor, icon: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="Portfolio / Profile URL"
                      value={newAuthor.portfolioUrl}
                      onChange={(e) => setNewAuthor({ ...newAuthor, portfolioUrl: e.target.value })}
                      className="w-1/2 px-2.5 py-1.5 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAuthorModal(false)}
                      className="px-2.5 py-1 rounded border border-border text-[10px] text-text-muted hover:text-text-main"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!newAuthor.name || createAuthorMutation.isPending}
                      onClick={() => createAuthorMutation.mutate(newAuthor)}
                      className="px-3 py-1 rounded bg-accent text-background font-bold text-[10px] hover:opacity-90 disabled:opacity-50"
                    >
                      {createAuthorMutation.isPending ? 'Saving...' : 'Create & Select'}
                    </button>
                  </div>
                </div>
              )}

              {/* Pre-available Authors Checklist */}
              {authors.length === 0 ? (
                <p className="text-[11px] text-text-muted italic">
                  No authors registered yet. Click &quot;+ New Author&quot; to add.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {authors.map((author) => {
                    const isSelected = formData.authorIds.includes(author.id);
                    return (
                      <div
                        key={author.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-accent/10 border-accent/40 text-text-main'
                            : 'bg-surface border-border text-text-muted hover:text-text-main'
                        }`}
                        onClick={() => toggleAuthorSelection(author.id)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent div click
                            className="rounded border-border pointer-events-none"
                          />
                          <span className="font-semibold truncate">{author.name}</span>
                          {author.portfolioUrl && (
                            <span className="text-[10px] text-text-muted truncate max-w-[120px]">
                              ({author.portfolioUrl.replace(/^https?:\/\//, '')})
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete author "${author.name}"?`)) {
                              deleteAuthorMutation.mutate(author.id);
                            }
                          }}
                          className="text-text-muted hover:text-rose-400 p-0.5 ml-2"
                          title="Delete author from database"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-text-muted">Tech Stack (Skills or Custom Tags)</label>
              {profileSkills.length > 0 && (
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !formData.tags.includes(val)) {
                      setFormData((prev) => ({
                        ...prev,
                        tags: [...prev.tags, val],
                      }));
                    }
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>-- Select from registered skills --</option>
                  {profileSkills.map((sk) => {
                    const isAlreadySelected = formData.tags.includes(sk.name);
                    return (
                      <option key={sk.id} value={sk.name} disabled={isAlreadySelected}>
                        {isAlreadySelected ? `✓ ${sk.name} (Added)` : `+ ${sk.name} (${sk.category})`}
                      </option>
                    );
                  })}
                </select>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Or type specific tech tag..."
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs text-text-main hover:bg-surface-hover flex-shrink-0"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] bg-background border border-border cursor-pointer hover:border-rose-400/50 hover:text-rose-400 text-text-main transition-colors group"
                    title="Click to remove"
                  >
                    <span>{tag}</span>
                    <span className="text-text-muted group-hover:text-rose-400">×</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured & Priority Settings */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-border"
                />
                <span>Featured Project</span>
              </label>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Featured Priority</label>
                <input
                  type="number"
                  value={formData.featuredPriority}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featuredPriority: parseInt(e.target.value) || 0 }))}
                  placeholder="0 (highest first)"
                  className="w-full px-2.5 py-1 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => saveMutation.mutate(formData)}
              disabled={!formData.title || !formData.summary || saveMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>{saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </div>

        {/* Projects List Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-main">
              Portfolio Projects ({projects.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="text-xs text-text-muted">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-8 text-center rounded-lg bg-background border border-border text-xs text-text-muted">
              No projects added yet. Create your first project using the form.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-background border border-border gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-surface border border-border overflow-hidden flex-shrink-0 relative">
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">N/A</div>
                      )}
                      {project.icon && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 rounded bg-background/90 flex items-center justify-center text-accent">
                          {renderResolvedIcon(project.icon, <FolderGit2 className="w-3 h-3 text-accent" />, "w-3 h-3 text-accent")}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-text-main truncate">{project.title}</span>
                        {project.isFeatured && (
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-accent/10 border border-accent/30 text-accent font-semibold">
                            <Star className="w-3 h-3 fill-accent" />
                            <span>P:{project.featuredPriority ?? 0}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-0.5">
                        <span className="text-accent">{project.category || 'Full Stack Web App'}</span>
                        <span>•</span>
                        <span>{project.level || 'Intermediate'}</span>
                        <span>•</span>
                        <span>{project.projectType || 'Personal Project'}</span>
                        {project.authors && project.authors.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-text-main flex items-center gap-1">
                              <Users className="w-3 h-3 text-accent" />
                              {project.authors.map((a) => a.name).join(', ')}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-[11px] text-text-muted truncate mt-0.5">{project.summary}</p>

                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.2 rounded bg-surface border border-border text-text-muted">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-[9px] text-text-muted">+{project.tags.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(project)}
                      className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface text-xs"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          deleteMutation.mutate(project.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-border text-rose-400 hover:bg-rose-500/10 text-xs"
                      title="Delete project"
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
