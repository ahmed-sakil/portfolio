import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Project, Author } from '../projects/ProjectCard';
import { ImageUploader } from './ImageUploader';
import { IconSelector } from './IconSelector';
import {
  Plus,
  Trash2,
  Edit2,
  Star,
  Users,
  User,
  Eye,
  Code,
  FolderGit2,
  HelpCircle,
  Copy,
  Check,
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
  const [showTemplateGuide, setShowTemplateGuide] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ name: '', icon: 'User', portfolioUrl: '' });

  const SAMPLE_CASE_STUDY_TEMPLATE = `<h3>// Executive Overview & Architecture</h3>
<p>
  A high-throughput distributed microservice built to manage real-time synchronized event state. 
  Engineered with a modular architecture ensuring sub-50ms query latency under high concurrent load.
</p>

<h3>// Key Engineering Capabilities</h3>
<ul>
  <li><strong>Real-time Streaming:</strong> Low-latency WebSocket connections with auto-reconnection and exponential backoff.</li>
  <li><strong>High-Performance In-Memory Cache:</strong> Redis caching layer reducing database pressure by 82%.</li>
  <li><strong>Fault Tolerance & Resilience:</strong> Circuit breaker pattern preventing cascading service degradation.</li>
</ul>

<h3>// Tech Stack & Tooling</h3>
<blockquote>
  Engineered using modern standards: React 19, TypeScript, PostgreSQL (Neon), Prisma ORM, Tailwind CSS, and Redis.
</blockquote>

<h3>// Core Implementation Walkthrough</h3>
<pre><code>// Example: Optimized In-Memory Cache Handler
export async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const fresh = await fetcher();
  await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  return fresh;
}</code></pre>

<h3>// Performance Benchmarks & Impact</h3>
<p>
  Deployed across redundant edge regions with 99.99% measured service availability. 
  Memory consumption remained under 120MB per pod during peak transaction traffic.
</p>`;

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

            {/* Project Icon (Lucide / Upload / OpenSourceIcon Link) */}
            <IconSelector
              label="Project Icon / Logo"
              value={formData.icon}
              onChange={(iconVal) => setFormData((prev) => ({ ...prev, icon: iconVal }))}
              presets={COMMON_PROJECT_ICONS}
              fallbackIcon={<FolderGit2 className="w-5 h-5 text-accent" />}
            />

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

            {/* Project Details and Case Study (HTML Editor with Live Preview & Design Helper) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-text-muted flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-accent" />
                  <span>Case Study & Architecture (HTML Code)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowTemplateGuide(!showTemplateGuide)}
                    className="px-2 py-0.5 rounded text-[10px] border border-accent/40 text-accent hover:bg-accent/10 transition-colors flex items-center gap-1"
                    title="View HTML Structure Guide and Sample Code"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>{showTemplateGuide ? 'Hide Guide' : 'Sample / Guide'}</span>
                  </button>
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

              {/* Template & Guidelines Panel */}
              {showTemplateGuide && (
                <div className="p-3.5 rounded-lg bg-surface border border-accent/30 text-xs space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-accent font-mono">// CASE_STUDY_DESIGN_STANDARDS</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, caseStudy: SAMPLE_CASE_STUDY_TEMPLATE }));
                          setActiveCaseStudyTab('editor');
                        }}
                        className="px-2 py-1 rounded bg-accent text-background font-bold text-[10px] hover:opacity-90 transition-opacity"
                      >
                        Insert Starter Template
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(SAMPLE_CASE_STUDY_TEMPLATE);
                          setCopiedTemplate(true);
                          setTimeout(() => setCopiedTemplate(false), 2000);
                        }}
                        className="p-1 rounded border border-border bg-background text-text-muted hover:text-text-main transition-colors"
                        title="Copy Sample Code to Clipboard"
                      >
                        {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                    Use semantic HTML tags. The system automatically styles them with monospace code formatting, accent borders, and responsive sizing:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-2 rounded bg-background border border-border/60">
                      <strong className="text-accent">&lt;h3&gt;// Heading&lt;/h3&gt;</strong>
                      <p className="text-text-muted mt-0.5 font-sans">Creates styled section breaks with accent coloring.</p>
                    </div>
                    <div className="p-2 rounded bg-background border border-border/60">
                      <strong className="text-accent">&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</strong>
                      <p className="text-text-muted mt-0.5 font-sans">Bullet points for key engineering capabilities.</p>
                    </div>
                    <div className="p-2 rounded bg-background border border-border/60">
                      <strong className="text-accent">&lt;pre&gt;&lt;code&gt;...&lt;/code&gt;&lt;/pre&gt;</strong>
                      <p className="text-text-muted mt-0.5 font-sans">Full-width dark syntax box with horizontal scroll.</p>
                    </div>
                    <div className="p-2 rounded bg-background border border-border/60">
                      <strong className="text-accent">&lt;blockquote&gt;...&lt;/blockquote&gt;</strong>
                      <p className="text-text-muted mt-0.5 font-sans">Highlights quotes or tech stacks with left accent border.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeCaseStudyTab === 'editor' ? (
                <textarea
                  rows={7}
                  value={formData.caseStudy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caseStudy: e.target.value }))}
                  placeholder="<h3>// Architecture Highlights</h3><p>Implemented distributed caching with Redis...</p>"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent resize-y font-mono"
                />
              ) : (
                <div
                  className="p-3.5 rounded-lg bg-background border border-border text-xs text-text-muted min-h-[140px] max-h-72 overflow-y-auto space-y-2 [&>h1]:text-sm [&>h1]:font-bold [&>h1]:text-accent [&>h2]:text-xs [&>h2]:font-bold [&>h2]:text-text-main [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-accent [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>code]:bg-surface [&>code]:px-1 [&>code]:text-accent [&>pre]:bg-surface [&>pre]:p-2.5 [&>pre]:rounded [&>pre]:border [&>pre]:border-border [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-2.5 [&>blockquote]:italic"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      formData.caseStudy || '<p className="text-text-muted italic">No HTML content yet. Type in the code editor or insert the Starter Template to see live preview.</p>',
                      { ADD_ATTR: ['target', 'rel'] }
                    ),
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
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-text-muted">Portfolio / Profile URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newAuthor.portfolioUrl}
                        onChange={(e) => setNewAuthor({ ...newAuthor, portfolioUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                      />
                    </div>

                    <IconSelector
                      label="Author Icon / Avatar"
                      value={newAuthor.icon}
                      onChange={(val) => setNewAuthor((prev) => ({ ...prev, icon: val }))}
                      presets={['User', 'Sparkles', 'Code2', 'Terminal', 'Github', 'Globe']}
                      fallbackIcon={<User className="w-4 h-4 text-accent" />}
                    />
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
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent div click
                            className="rounded border-border pointer-events-none"
                          />
                          <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0">
                            {renderResolvedIcon(author.icon, <User className="w-3 h-3 text-accent" />, "w-full h-full object-contain text-accent")}
                          </div>
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
                      ) : project.icon ? (
                        <div className="w-full h-full flex items-center justify-center p-1.5 bg-background">
                          {renderResolvedIcon(
                            project.icon,
                            <FolderGit2 className="w-6 h-6 text-accent" />,
                            "w-6 h-6 text-accent",
                            "w-full h-full object-contain p-0"
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">N/A</div>
                      )}
                      {project.thumbnail && project.icon && (
                        <div className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-background/95 border border-border flex items-center justify-center text-accent p-0.5 overflow-hidden shadow-xs">
                          {renderResolvedIcon(
                            project.icon,
                            <FolderGit2 className="w-3.5 h-3.5 text-accent" />,
                            "w-3.5 h-3.5 text-accent",
                            "w-full h-full object-contain p-0"
                          )}
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
