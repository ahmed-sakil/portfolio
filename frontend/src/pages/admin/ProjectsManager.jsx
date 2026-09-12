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
  Link as LinkIcon
} from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import AppIcon from '../../components/icons/AppIcon';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const ProjectsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    live_link: '',
    github_link: '',
    is_featured: true,
    priority: 1,
    level: 'Intermediate',
    project_type: 'PERSONAL'
  });

  const [techStack, setTechStack] = useState([]);
  const [customTech, setCustomTech] = useState('');

  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', portfolio_url: '' });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, portRes] = await Promise.all([
        api.get('/admin/projects').catch(() => api.get('/portfolio')),
        api.get('/portfolio').catch(() => ({ data: { skills: [] } }))
      ]);
      setProjects(projRes.data.projects || projRes.data || []);
      setSkills(portRes.data?.skills || []);
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
      project_type: 'PERSONAL'
    });
    setTechStack([]);
    setCustomTech('');
    setTeamMembers([]);
    setNewMember({ name: '', role: '', portfolio_url: '' });
    setImage(null);
    setImagePreview(null);
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

  const handleAddTeamMember = (e) => {
    e?.preventDefault();
    if (!newMember.name.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        name: newMember.name.trim(),
        role: newMember.role.trim() || 'Contributor',
        portfolio_url: newMember.portfolio_url.trim()
      }
    ]);
    setNewMember({ name: '', role: '', portfolio_url: '' });
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
    setFormData({
      title: project.title,
      description: project.description || '',
      live_link: project.live_link || '',
      github_link: project.github_link || '',
      is_featured: project.is_featured !== false,
      priority: project.priority ?? 1,
      level: project.level || 'Intermediate',
      project_type: project.project_type || 'PERSONAL'
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

            {/* Level & Project Type in 2-col mini grid */}
            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label className="admin-label">Project Scope</label>
                <select
                  className="admin-input"
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                >
                  <option value="PERSONAL">Personal Project</option>
                  <option value="TEAM">Team / Collaborative</option>
                </select>
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
                Select technologies from your skills library to automatically display their brand icons, or type custom tags.
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

            {/* Team Members Manager (visible if project_type === 'TEAM') */}
            {formData.project_type === 'TEAM' && (
              <div className="md:col-span-2 p-5 rounded-2xl border border-teal-400/30 bg-slate-900/60 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span className="text-sm font-bold text-white">Team Members & Collaborators</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
                  </span>
                </div>

                {/* Member Input Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Member Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      className="admin-input text-xs"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Role / Contribution</label>
                    <input
                      type="text"
                      placeholder="e.g. UI/UX Designer or Backend Dev"
                      className="admin-input text-xs"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1">Portfolio / Profile Link</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        className="admin-input text-xs"
                        value={newMember.portfolio_url}
                        onChange={(e) => setNewMember({ ...newMember, portfolio_url: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={handleAddTeamMember}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold hover:from-teal-300 hover:to-cyan-300 transition shrink-0"
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
                        className="p-3 rounded-xl border border-white/10 bg-slate-800/60 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>{member.name}</span>
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
            )}

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
                          {project.project_type === 'TEAM' ? (
                            <>
                              <Users className="w-2.5 h-2.5 text-cyan-400" />
                              Team ({members.length})
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

                    {project.image_url && (
                      <div className="relative mb-3 h-36 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

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
