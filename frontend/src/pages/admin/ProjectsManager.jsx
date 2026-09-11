import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Edit2, Trash2, Image as ImageIcon, ExternalLink, X, Briefcase } from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';

const ProjectsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    live_link: '',
    github_link: '',
    tech_stack: '',
    is_featured: true,
    priority: 1
  });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/admin/projects')
        .catch(() => api.get('/portfolio'));
      setProjects(res.data.projects || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      live_link: '',
      github_link: '',
      tech_stack: '',
      is_featured: true,
      priority: projects.length + 1
    });
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'tech_stack' && typeof formData.tech_stack === 'string') {
        const stackArr = formData.tech_stack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        data.append('tech_stack', JSON.stringify(stackArr));
      } else {
        data.append(key, formData[key] ?? '');
      }
    });
    if (image) data.append('image', image);

    try {
      if (editingId) {
        await api.put(`/admin/projects/${editingId}`, data);
      } else {
        await api.post('/admin/projects', data);
      }
      resetForm();
      fetchProjects();
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
      tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      is_featured: project.is_featured !== false,
      priority: project.priority ?? 1
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      fetchProjects();
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
                Showcase your builds, web apps, and open-source packages.
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
            <div>
              <label className="admin-label">Project Title *</label>
              <input
                type="text"
                placeholder="e.g. Modern AI Workspace"
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Tailwind CSS, Node.js, PostgreSQL"
                className="admin-input"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              />
            </div>

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

            <div className="md:col-span-2">
              <label className="admin-label">Project Description *</label>
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
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>
                )}
              </div>

              {/* Sequence Indicator below the input */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Public Display Sequence:</span>
                {formData.is_featured ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-400/10 border border-teal-400/30 text-teal-300 font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Sequence Slot #{formData.priority} (Lower number appears earlier in Featured Projects)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-500/10 border border-gray-500/20 text-gray-400 font-mono">
                    Hidden from Portfolio
                  </span>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="admin-label">Project Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="admin-btn-secondary cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-1 text-teal-400" />
                  <span>Upload Screenshot</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                  />
                </label>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {image ? image.name : editingId ? 'Leave empty to keep existing image' : 'No image chosen'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Project' : 'Add Project'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Projects Archive ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No projects added yet. Create your first project above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    {project.is_featured !== false ? (
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-400/10 border border-teal-400/30 text-teal-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        Slot #{project.priority ?? 1}
                      </span>
                    ) : (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
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

                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tech_stack.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-2">
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                        title="Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
