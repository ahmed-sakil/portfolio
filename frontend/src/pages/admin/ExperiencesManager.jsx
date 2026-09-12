import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Edit2, Trash2, Plus, X, GraduationCap, Briefcase, Calendar, ExternalLink, Image as ImageIcon, Upload } from 'lucide-react';

const ExperiencesManager = () => {
  const token = useAuthStore((state) => state.token);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'EXPERIENCE',
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    result: '',
    institution_url: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/portfolio');
      setExperiences(res.data.experiences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperiences(); }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: 'EXPERIENCE',
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      result: '',
      institution_url: '',
      image_url: '',
    });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'end_date' && formData.is_current) {
          submitData.append('end_date', '');
        } else if (formData[key] !== null && formData[key] !== undefined) {
          submitData.append(key, formData[key]);
        }
      });
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingId) {
        await api.put(`/admin/experiences/${editingId}`, submitData);
      } else {
        await api.post('/admin/experiences', submitData);
      }
      resetForm();
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving experience entry.');
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      type: exp.type,
      title: exp.title,
      company: exp.company,
      start_date: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
      end_date: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
      is_current: exp.is_current || false,
      description: exp.description || '',
      result: exp.result || '',
      institution_url: exp.institution_url || '',
      image_url: exp.image_url || '',
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.delete(`/admin/experiences/${id}`);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert('Error deleting entry.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Experience Form Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Career / Education Entry' : 'Add Experience or Education'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Record your employment history, client roles, university degrees, and credentials.
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
          {/* Type Toggle */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'EXPERIENCE' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                formData.type === 'EXPERIENCE'
                  ? 'bg-teal-400/20 border-teal-400/40 text-teal-300'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" /> Work Experience
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'EDUCATION' })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                formData.type === 'EDUCATION'
                  ? 'bg-teal-400/20 border-teal-400/40 text-teal-300'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Education & Degree
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">
                {formData.type === 'EXPERIENCE' ? 'Job Title / Role *' : 'Degree / Field of Study *'}
              </label>
              <input
                type="text"
                placeholder={formData.type === 'EXPERIENCE' ? 'e.g. Senior Full Stack Engineer' : 'e.g. B.Sc. in Computer Science'}
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">
                {formData.type === 'EXPERIENCE' ? 'Company / Organization *' : 'Institution / University *'}
              </label>
              <input
                type="text"
                placeholder={formData.type === 'EXPERIENCE' ? 'e.g. Acme Tech Solutions' : 'e.g. Stanford University'}
                className="admin-input"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="admin-label">Start Date *</label>
              <input
                type="date"
                className="admin-input"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="admin-label mb-0">End Date</label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-400"
                  />
                  <span>Currently Here</span>
                </label>
              </div>
              <input
                type="date"
                disabled={formData.is_current}
                className="admin-input disabled:opacity-30 disabled:cursor-not-allowed"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">Institution / Company Website (Optional)</label>
              <input
                type="url"
                placeholder="https://company.com"
                className="admin-input"
                value={formData.institution_url}
                onChange={(e) => setFormData({ ...formData, institution_url: e.target.value })}
              />
            </div>

            <div>
              <label className="admin-label">
                {formData.type === 'EXPERIENCE' ? 'Employment Type (Optional)' : 'Result / Grade / GPA (Optional)'}
              </label>
              <input
                type="text"
                placeholder={formData.type === 'EXPERIENCE' ? 'e.g. Full-time, Remote' : 'e.g. CGPA 3.92 / 4.00, Grade A, First Class'}
                className="admin-input"
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Type whatever text you want displayed (e.g. &quot;CGPA: 3.85&quot; or &quot;Grade: A+&quot;)
              </span>
            </div>

            {/* Institute / Company Logo / Profile Image */}
            <div className="md:col-span-2">
              <label className="admin-label flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                <span>Institute / Company Profile Image (Logo)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                {(imageFile || formData.image_url) && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/40 border border-teal-400/40 shrink-0 p-1">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.image_url}
                      alt="Logo preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setFormData({ ...formData, image_url: '' }); }}
                      className="absolute top-0 right-0 bg-red-500/80 hover:bg-red-500 text-white rounded-bl p-0.5"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex items-center gap-3">
                    <label className="admin-btn-secondary cursor-pointer inline-flex items-center gap-2 text-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{imageFile ? 'Change Image File' : 'Upload Logo / Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    <span className="text-xs text-gray-400">or enter direct image URL below</span>
                  </div>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    className="admin-input text-xs"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="admin-label">Key Responsibilities / Achievements</label>
              <textarea
                placeholder="Highlights of what you engineered, team leadership, or courses mastered..."
                className="admin-input"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button type="submit" className="admin-btn-primary">
              <Plus className="w-4 h-4 mr-1.5" />
              {editingId ? 'Update Entry' : 'Add Entry'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Experiences & Education List Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Career & Education History ({experiences.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading entries...
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            No experiences or education records added yet. Add your first record above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl border flex flex-col justify-between group hover:border-teal-400/40 transition-all"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400">
                        {exp.type === 'EXPERIENCE' ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase" style={{ color: 'var(--accent)' }}>
                        {exp.type === 'EXPERIENCE' ? 'Experience' : 'Education'}
                      </span>
                    </div>

                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      {' - '}
                      {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-2">
                    {exp.image_url && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1 shrink-0">
                        <img
                          src={exp.image_url}
                          alt={exp.company}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                        {exp.title}
                      </h3>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {exp.company}
                        {exp.result && <span className="ml-2 font-normal text-teal-400 font-mono">• {exp.result}</span>}
                      </p>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    {exp.institution_url && (
                      <a
                        href={exp.institution_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-teal-400 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 transition"
                      title="Edit Entry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition"
                      title="Delete Entry"
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

export default ExperiencesManager;
