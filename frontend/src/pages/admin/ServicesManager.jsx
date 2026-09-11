import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Edit2, Trash2, Sparkles, Layers, Code2, Database, Layout, PenTool, Terminal } from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Layers,
  Code2,
  Database,
  Layout,
  PenTool,
  Terminal,
};

const ServicesManager = () => {
  const token = useAuthStore((state) => state.token);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Code2',
    order: 0,
  });

  const fetchServices = async () => {
    try {
      const res = await api.get('/admin/services');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', icon_name: 'Code2', order: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/services/${editingId}`, formData);
      } else {
        await api.post('/admin/services', formData);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Error saving service';
      alert(msg);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description || '',
      icon_name: service.icon_name || 'Code2',
      order: service.order || 0,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Error deleting service');
    }
  };

  const renderIcon = (name) => {
    const IconComp = ICON_MAP[name] || Code2;
    return <IconComp className="w-5 h-5 text-teal-400" />;
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Provided Service' : 'Add New Service That You Provide'}
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Highlight consulting, full stack development, API architecture, and other solutions you deliver.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Service Title</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Web Development"
                required
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Icon Selection</label>
              <select
                className="admin-input"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              >
                <option value="Code2">Code2 (Software Engineering)</option>
                <option value="Layers">Layers (Full Stack Architecture)</option>
                <option value="Database">Database (Backend & Data Modeling)</option>
                <option value="Layout">Layout (Frontend & UI Engineering)</option>
                <option value="Terminal">Terminal (DevOps & Systems)</option>
                <option value="Sparkles">Sparkles (AI & Innovation)</option>
                <option value="PenTool">PenTool (Design & Prototyping)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label">Service Description</label>
            <textarea
              placeholder="Describe what value and capabilities you provide to clients or teams..."
              rows={3}
              required
              className="admin-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="admin-label">Display Order</label>
            <input
              type="number"
              min="0"
              className="admin-input max-w-xs"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            />
            <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
              Lower numbers appear first
            </span>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Service' : 'Add Service'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List */}
      <div className="admin-card p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Provided Services ({services.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No services registered yet. Add your first service above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30">
                      {renderIcon(service.icon_name)}
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                      #{service.order}
                    </span>
                  </div>

                  <h3 className="font-bold text-base mb-2 text-white" style={{ color: 'var(--text-primary)' }}>
                    {service.title}
                  </h3>

                  <p className="text-xs leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManager;
