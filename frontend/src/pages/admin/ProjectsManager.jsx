import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  ExternalLink, 
  X, 
  Briefcase, 
  Users, 
  User, 
  Check, 
  Layers,
  Sparkles,
  Link as LinkIcon,
  Upload,
  UserCheck
} from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import AppIcon from '../../components/icons/AppIcon';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORY_OPTIONS = [
  { value: 'Personal', label: 'Personal Project' },
  { value: 'Group', label: 'Group / Team Project' }
];

const SUGGESTED_TYPES = [
  'Full Stack Web App',
  'Frontend Application',
  'Backend API / System',
  'Mobile Application',
  'AI / Machine Learning',
  'DevOps / Cloud Architecture',
  'Open Source Tool',
  'CLI Utility'
];

const ProjectsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    live_link: '',
    github_link: '',
    is_featured: true,
    priority: 1,
    level: 'Intermediate',
    category: 'Personal',
    type: 'Full Stack Web App',
    icon_url: ''
  });

  const [techStack, setTechStack] = useState([]);
  const [customTech, setCustomTech] = useState('');

  // Team members state
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', portfolio_url: '', avatar_url: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Cover image and Project Icon files
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, portRes] = await Promise.all([
        api.get('/admin/projects').catch(() => api.get('/portfolio')),
        api.get('/portfolio').catch(() => ({ data: { skills: [], profile: null } }))
      ]);
      setProjects(projRes.data.projects || projRes.data || []);
      setSkills(portRes.data?.skills || []);
      setAdminProfile(portRes.data?.profile || null);
    } catch (err) {
      console.error('Fetch projects/skills error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      live_link: '',
      github_link: '',
      is_featured: true,
      priority: projects.length + 1,
      level: 'Intermediate',
      category: 'Personal',
      type: 'Full Stack Web App',
      icon_url: ''
    });
    setTechStack([]);
    setCustomTech('');
    setTeamMembers([]);
    setNewMember({ name: '', role: '', portfolio_url: '', avatar_url: '' });
    setImage(null);
    setImagePreview(null);
    setIconFile(null);
    setIconPreview(null);
  };

  // Helper to match skill metadata for an icon
  const getSkillMeta = (techName) => {
    if (!techName) return null;
    const norm = techName.trim().toLowerCase();
    return skills.find((s) => s.name.toLowerCase() === norm);
  };

  const handleAddTechSkill = (skillName) => {
    if (!skillName) return;
    if (!techStack.includes(skillName)) {
      setTechStack([...techStack, skillName]);
    }
  };

  const handleAddCustomTech = (e) => {
    e?.preventDefault();
    const clean = customTech.trim();
    if (clean && !techStack.includes(clean)) {
      setTechStack([...techStack, clean]);
      setCustomTech('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setTechStack(techStack.filter((t) => t !== techToRemove));
  };

  // Upload avatar for a team member
  const handleMemberAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/admin/upload-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewMember((prev) => ({ ...prev, avatar_url: res.data.url }));
    } catch (err) {
      console.error('Member avatar upload error:', err);
      alert('Failed to upload member avatar image.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Fill newMember with current Admin / Creator info
  const handleFillMyInfo = () => {
    if (!adminProfile) return;
    setNewMember({
      name: adminProfile.full_name || 'Sakil Ahmed',
      role: adminProfile.role || adminProfile.title || 'Creator & Lead Developer',
      portfolio_url: window.location.origin,
      avatar_url: adminProfile.profile_image_url || ''
    });
  };

  const handleAddTeamMember = (e) => {
    e?.preventDefault();
    if (!newMember.name.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        name: newMember.name.trim(),
        role: newMember.role.trim() || 'Contributor',
        portfolio_url: newMember.portfolio_url.trim(),
        avatar_url: newMember.avatar_url.trim()
      }
    ]);
    setNewMember({ name: '', role: '', portfolio_url: '', avatar_url: '' });
  };

  const handleRemoveTeamMember = (indexToRemove) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key] ?? '');
    });

    data.append('tech_stack', JSON.stringify(techStack));
    data.append('team_members', JSON.stringify(teamMembers));

    if (image) {
      data.append('image', image);
    }

    if (iconFile) {
      data.append('icon', iconFile);
    }

    try {
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, data);
      } else {
        await api.post('/admin/projects', data);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error saving project.');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    const categoryVal = project.category || (project.project_type === 'TEAM' ? 'Group' : 'Personal');
    setFormData({
      title: project.title,
      description: project.description || '',
      live_link: project.live_link || '',
      github_link: project.github_link || '',
      is_featured: project.is_featured !== false,
      priority: project.priority ?? 1,
      level: project.level || 'Intermediate',
      category: categoryVal,
      type: project.type || 'Full Stack Web App',
      icon_url: project.icon_url || ''
    });

    // Parse tech stack
    let parsedStack = [];
    if (Array.isArray(project.tech_stack)) {
      parsedStack = project.tech_stack;
    } else if (typeof project.tech_stack === 'string') {
      try {
        parsedStack = JSON.parse(project.tech_stack);
      } catch {
        parsedStack = project.tech_stack.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    setTechStack(parsedStack || []);

    // Parse team members
    let parsedMembers = [];
    if (project.team_members) {
      if (Array.isArray(project.team_members)) {
        parsedMembers = project.team_members;
      } else if (typeof project.team_members === 'string') {
        try {
          parsedMembers = JSON.parse(project.team_members);
        } catch {
          parsedMembers = [];
        }
      }
    }
    setTeamMembers(parsedMembers || []);

    setImage(null);
    setImagePreview(project.image_url || null);
    setIconFile(null);
    setIconPreview(project.icon_url || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error deleting project.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Showcase personal and collaborative systems, select skills with icons, and set levels.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="admin-label">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Modern Cloud AI Workspace"
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category (Personal / Group) & Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Category</label>
                <select
                  className="admin-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Project Level</label>
                <select
                  className="admin-input"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  {LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Type String */}
            <div>
              <label className="admin-label">Project Type (Architecture / Role) *</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web App, Mobile Application, AI Tool"
                className="admin-input"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] text-gray-400 self-center">Suggestions:</span>
                {SUGGESTED_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t })}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-teal-400/20 hover:text-teal-300 text-gray-400 transition"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Square Icon */}
            <div>
              <label className="admin-label">Project Icon (Square Logo)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer border border-dashed rounded-xl px-4 py-2.5 flex items-center gap-2 hover:border-teal-400/50 transition bg-black/20" style={{ borderColor: 'var(--border-subtle)' }}>
                  <Upload className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400">Upload Square Icon</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setIconFile(file);
                        setIconPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>

                {iconPreview ? (
                  <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-teal-400/50 bg-slate-900 p-1 shrink-0 aspect-square shadow">
                    <img src={iconPreview} alt="Project Icon" className="w-full h-full object-cover rounded-lg" />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-xl border border-dashed border-white/20 bg-white/5 flex items-center justify-center text-gray-500 text-[10px] aspect-square shrink-0">
                    Square
                  </div>
                )}

                <input
                  type="url"
                  placeholder="Or paste icon image URL"
                  className="admin-input text-xs flex-1"
                  value={formData.icon_url}
                  onChange={(e) => {
                    setFormData({ ...formData, icon_url: e.target.value });
                    if (!iconFile) setIconPreview(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Live Preview Link */}
            <div>
              <label className="admin-label">Live Preview URL (Optional)</label>
              <input
                type="url"
                placeholder="https://myproject.com"
                className="admin-input"
                value={formData.live_link}
                onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
              />
            </div>

            {/* GitHub Repo */}
            <div>
              <label className="admin-label">GitHub Repository URL (Optional)</label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                className="admin-input"
                value={formData.github_link}
                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              />
            </div>

            {/* Tech Stack Selector */}
            <div className="md:col-span-2 p-4 sm:p-5 rounded-2xl border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div className="flex items-center justify-between mb-2">
                <label className="admin-label mb-0">Technologies & Tech Stack</label>
                <span className="text-xs font-mono text-teal-400">
                  {techStack.length} selected
                </span>
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                Select technologies from your skills library to automatically display brand icons, or type custom tags.
              </p>

              {/* Selected Pills */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[38px] p-2 rounded-xl bg-slate-900/60 border border-white/5 items-center">
                {techStack.length === 0 ? (
                  <span className="text-xs text-gray-500 italic px-2">No technologies selected yet. Click from skills below or type custom tag.</span>
                ) : (
                  techStack.map((tech) => {
                    const meta = getSkillMeta(tech);
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-white"
                      >
                        <AppIcon
                          iconUrl={meta?.icon_url}
                          iconName={meta?.icon_name || tech}
                          iconType={meta?.icon_type || 'light'}
                          className="w-3.5 h-3.5"
                          alt={tech}
                        />
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="text-gray-400 hover:text-red-400 ml-0.5 transition"
                          title={`Remove ${tech}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              {/* Skills Quick Pick & Custom Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">Pick from Skills Library</label>
                  <select
                    className="admin-input text-xs"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTechSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">-- Choose skill to add to project --</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-1">Or Add Custom Technology</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Socket.io, WebAssembly, Stripe"
                      className="admin-input text-xs"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTech();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTech}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-400/20 border border-teal-400/40 text-teal-300 hover:bg-teal-400/30 transition shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members / Contributor Info (Available for both Personal & Group projects) */}
            <div className="md:col-span-2 p-5 rounded-2xl border border-teal-400/30 bg-slate-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-bold text-white">
                    {formData.category === 'Group' ? 'Team Members & Collaborators' : 'Author & Contributor Info'}
                  </span>
                  <span className="text-xs font-mono text-gray-400 ml-2">
                    ({teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'})
                  </span>
                </div>

                {adminProfile && (
                  <button
                    type="button"
                    onClick={handleFillMyInfo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-400/10 border border-teal-400/30 text-teal-300 hover:bg-teal-400 hover:text-black transition"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Auto-fill My Profile Info</span>
                  </button>
                )}
              </div>

              {/* Member Input Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Member Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sakil Ahmed"
                    className="admin-input text-xs"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Role / Responsibility</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Full Stack Developer"
                    className="admin-input text-xs"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Portfolio / Profile Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="admin-input text-xs"
                    value={newMember.portfolio_url}
                    onChange={(e) => setNewMember({ ...newMember, portfolio_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1">Avatar / Photo</label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-2 rounded-xl text-xs font-semibold border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 transition shrink-0 flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>{avatarUploading ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={avatarUploading}
                        onChange={handleMemberAvatarUpload}
                      />
                    </label>
                    {newMember.avatar_url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-400/50 shrink-0">
                        <img src={newMember.avatar_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleAddTeamMember}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-teal-400 text-black hover:bg-teal-300 transition shrink-0 ml-auto"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              {teamMembers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {teamMembers.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-white/10 bg-slate-800/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover border border-teal-400/40 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {member.name}
                          </div>
                          <div className="text-[11px] text-gray-400 truncate">{member.role}</div>
                          {member.portfolio_url && (
                            <a
                              href={member.portfolio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-teal-400 hover:underline flex items-center gap-1 mt-0.5 truncate"
                            >
                              <LinkIcon className="w-2.5 h-2.5" /> Portfolio
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(idx)}
                        className="p-1 text-gray-400 hover:text-red-400 transition shrink-0"
                        title="Remove Member"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="admin-label">Project Overview / Description *</label>
              <textarea
                placeholder="Describe the architectural design, problem solved, or key features..."
                className="admin-input"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Feature Toggle & Priority Sequence */}
            <div className="md:col-span-2 p-5 rounded-2xl border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 text-teal-400 focus:ring-teal-400/30 bg-black/40 cursor-pointer"
                  />
                  <div>
                    <span className="text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>Feature on Public Portfolio</span>
                    <span className="text-xs block" style={{ color: 'var(--text-secondary)' }}>
                      {formData.is_featured ? 'Visible in Featured Projects on public homepage' : 'Hidden from public homepage'}
                    </span>
                  </div>
                </label>

                {formData.is_featured && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-secondary)' }}>Priority / Sequence #:</label>
                    <input
                      type="number"
                      min="1"
                      className="admin-input !w-24 text-center font-mono font-bold"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="md:col-span-2">
              <label className="admin-label">Project Cover Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <label className="cursor-pointer border-2 border-dashed rounded-xl px-6 py-4 flex items-center justify-center gap-3 hover:border-teal-400/50 transition bg-black/20" style={{ borderColor: 'var(--border-subtle)' }}>
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-xs font-semibold text-teal-400">Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
                {image && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> {image.name}
                  </span>
                )}
                {imagePreview && (
                  <div className="w-20 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Save Changes' : 'Add Project'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Inventory Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Project Catalog ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No projects found. Add your first project above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const parsedStack = Array.isArray(project.tech_stack)
                ? project.tech_stack
                : (typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack || '[]') : []);

              const members = project.team_members
                ? (Array.isArray(project.team_members) ? project.team_members : JSON.parse(project.team_members || '[]'))
                : [];

              const category = project.category || (project.project_type === 'TEAM' ? 'Group' : 'Personal');

              return (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300">
                          {project.level || 'Intermediate'}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center gap-1">
                          {category === 'Group' ? (
                            <>
                              <Users className="w-2.5 h-2.5 text-cyan-400" />
                              Group ({members.length})
                            </>
                          ) : (
                            <>
                              <User className="w-2.5 h-2.5 text-gray-400" />
                              Personal
                            </>
                          )}
                        </span>
                      </div>

                      {project.is_featured !== false ? (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-400/10 border border-teal-400/30 text-teal-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          #{project.priority ?? 1}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Cover Screenshot with square Project Icon overlay */}
                    {project.image_url ? (
                      <div className="relative mb-3 h-36 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {project.icon_url && (
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-lg overflow-hidden border border-white/30 bg-slate-950/80 p-0.5 shadow">
                            <img src={project.icon_url} alt="" className="w-full h-full object-cover rounded" />
                          </div>
                        )}
                      </div>
                    ) : (
                      project.icon_url && (
                        <div className="mb-3 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-slate-900 p-1">
                            <img src={project.icon_url} alt="" className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <span className="text-xs text-gray-400">{project.type || 'Web Application'}</span>
                        </div>
                      )
                    )}

                    <div className="text-[11px] font-medium text-teal-400 mb-0.5 uppercase tracking-wider">
                      {project.type || 'Web Application'}
                    </div>

                    <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>

                    <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {project.description}
                    </p>

                    {parsedStack && parsedStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {parsedStack.map((t, idx) => {
                          const meta = getSkillMeta(t);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                            >
                              <AppIcon
                                iconUrl={meta?.icon_url}
                                iconName={meta?.icon_name || t}
                                iconType={meta?.icon_type || 'light'}
                                className="w-3 h-3"
                                alt={t}
                              />
                              <span>{t}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/project/${project.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
                        title="View Public Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Details
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
