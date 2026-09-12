import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Edit2, Trash2, Plus, Image as ImageIcon, X, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogsManager = () => {
  const token = useAuthStore((state) => state.token);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: true,
    is_featured: true,
    priority: 1,
  });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/admin/blogs')
        .catch(() => api.get('/portfolio'));
      setBlogs(res.data.blogs || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      is_published: true,
      is_featured: true,
      priority: blogs.length + 1
    });
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key] ?? ''));
    if (image) data.append('cover_image', image);

    try {
      if (editingId) {
        await api.put(`/admin/blogs/${editingId}`, data);
      } else {
        await api.post('/admin/blogs', data);
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving blog post.');
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      is_published: blog.is_published !== false,
      is_featured: blog.is_featured !== false,
      priority: blog.priority ?? 1,
    });
    setImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/admin/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Error deleting post.');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Publish technical tutorials, engineering insights, and deep-dives.
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
              <label className="admin-label">Article Title *</label>
              <input
                type="text"
                placeholder="e.g. Scaling React Applications with Microfrontends"
                className="admin-input"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: editingId ? formData.slug : generateSlug(title),
                  });
                }}
                required
              />
            </div>

            <div>
              <label className="admin-label">URL Slug *</label>
              <input
                type="text"
                placeholder="scaling-react-applications"
                className="admin-input font-mono text-sm"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="admin-label">Short Excerpt *</label>
              <input
                type="text"
                placeholder="A brief 1-2 sentence preview summary..."
                className="admin-input"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
                      {formData.is_featured ? 'Visible in Featured Articles on public homepage' : 'Hidden from public homepage'}
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
                    Sequence Slot #{formData.priority} (Lower number appears earlier in Featured Articles)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-500/10 border border-gray-500/20 text-gray-400 font-mono">
                    Hidden from Portfolio
                  </span>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="admin-label">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="admin-btn-secondary cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-1 text-teal-400" />
                  <span>Upload Header Image</span>
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

            <div className="md:col-span-2">
              <label className="admin-label">Article Body (Markdown Supported) *</label>
              <textarea
                placeholder="Write your article in Markdown or HTML..."
                className="admin-input font-mono text-sm leading-relaxed"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Article' : 'Publish Article'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Articles List Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Published Articles ({blogs.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No articles written yet. Publish your first article above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    {blog.is_featured !== false ? (
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-teal-400/10 border border-teal-400/30 text-teal-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        Slot #{blog.priority ?? 1}
                      </span>
                    ) : (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10" style={{ color: 'var(--text-muted)' }}>
                        Hidden
                      </span>
                    )}
                  </div>

                  {blog.cover_image_url && (
                    <div className="relative mb-3 h-36 rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={blog.cover_image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    {blog.title}
                  </h3>

                  <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {blog.excerpt}
                  </p>

                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    /{blog.slug}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <Link
                    to={`/blog/${blog.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                    title="View Published Post"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                      title="Edit Article"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                      title="Delete Article"
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

export default BlogsManager;
