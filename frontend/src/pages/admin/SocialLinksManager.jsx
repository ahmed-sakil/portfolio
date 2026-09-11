import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Plus, Edit2, Trash2, ExternalLink, Share2, Globe, X } from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import SocialIcon from '../../components/icons/SocialIcon';

const SocialLinksManager = () => {
  const token = useAuthStore((state) => state.token);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon_name: '',
    order: 0,
    show_in_hero: true,
    show_in_footer: true,
  });

  const fetchSocialLinks = async () => {
    try {
      const res = await api.get('/admin/social-links');
      setLinks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      platform: '',
      url: '',
      icon_name: '',
      order: 0,
      show_in_hero: true,
      show_in_footer: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/social-links/${editingId}`, formData);
      } else {
        await api.post('/admin/social-links', formData);
      }
      resetForm();
      fetchSocialLinks();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Error saving social link';
      alert(msg);
    }
  };

  const handleEdit = (link) => {
    setEditingId(link.id);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon_name: link.icon_name || '',
      order: link.order || 0,
      show_in_hero: link.show_in_hero !== false,
      show_in_footer: link.show_in_footer !== false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    try {
      await api.delete(`/admin/social-links/${id}`);
      fetchSocialLinks();
    } catch (err) {
      console.error(err);
      alert('Error deleting social link');
    }
  };

  return (
    <div className="space-y-8">
      {/* Social Link Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Social Link' : 'Add Social / Professional Link'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Link your profiles (GitHub, LinkedIn, X/Twitter, Discord, etc.) across Hero, Footer, and Contact sections.
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
              <label className="admin-label">Platform Name *</label>
              <input
                type="text"
                placeholder="e.g. GitHub, LinkedIn, Twitter"
                className="admin-input"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Profile URL *</label>
              <input
                type="url"
                placeholder="https://..."
                className="admin-input"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Icon Name (Optional identifier)</label>
              <input
                type="text"
                placeholder="e.g. github, linkedin, twitter, facebook"
                className="admin-input font-mono text-sm"
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Display Order</label>
              <input
                type="number"
                min="0"
                className="admin-input !w-32 font-mono"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              />
              <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                Lower numbers appear first
              </span>
            </div>

            {/* Placements Card */}
            <div className="md:col-span-2 p-5 rounded-2xl border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <span className="text-xs font-bold block mb-3" style={{ color: 'var(--text-primary)' }}>
                Section Placements
              </span>
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.show_in_hero}
                    onChange={(e) => setFormData({ ...formData, show_in_hero: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-400 focus:ring-teal-400/30 bg-black/40"
                  />
                  <div>
                    <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>Hero Section</span>
                    <span className="text-xs block" style={{ color: 'var(--text-secondary)' }}>Show in top hero social icons row</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.show_in_footer}
                    onChange={(e) => setFormData({ ...formData, show_in_footer: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-400 focus:ring-teal-400/30 bg-black/40"
                  />
                  <div>
                    <span className="text-sm font-semibold block" style={{ color: 'var(--text-primary)' }}>Footer Section</span>
                    <span className="text-xs block" style={{ color: 'var(--text-secondary)' }}>Show in website bottom footer list</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Link' : 'Add Link'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Social Links List Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Connected Profiles ({links.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading links...
          </div>
        ) : links.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No social links configured yet. Add your first link above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {links.map((link) => (
              <div
                key={link.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400">
                      <SocialIcon name={link.icon_name || link.platform} className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                      #{link.order}
                    </span>
                  </div>

                  <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    {link.platform}
                  </h3>

                  <p className="text-xs truncate font-mono mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {link.url}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {link.show_in_hero && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                        ✓ Hero
                      </span>
                    )}
                    {link.show_in_footer && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        ✓ Footer
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                      ✓ Connect
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-teal-400 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Visit
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(link)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                      title="Edit Link"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                      title="Delete Link"
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

export default SocialLinksManager;
