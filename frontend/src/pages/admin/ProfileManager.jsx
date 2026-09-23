import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { 
  CheckCircle, 
  Image as ImageIcon, 
  ExternalLink, 
  User, 
  Mail, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileManager = () => {
  const token = useAuthStore((state) => state.token);
  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({ 
    full_name: '',
    role: '',
    years_of_experience: '',
    resume_drive_link: '',
    bio: '',
    journey_text: '',
    email: '',
    phone: '',
    location: '', 
    github_username: '',
    leetcode_username: '',
    codeforces_username: '',
    hero_image_url: '',
    icon_image_url: '',
    journey_image_url: '',
    favicon_url: '',
    connect_message: '',
  });
  const [heroImage, setHeroImage] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [journeyImage, setJourneyImage] = useState(null);
  const [faviconImage, setFaviconImage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Account Security Credentials State
  const [credData, setCredData] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [credStatus, setCredStatus] = useState(null);
  const [updatingCreds, setUpdatingCreds] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/portfolio');
        if (res.data.profile) {
          const profile = res.data.profile;
          setInitialData(profile);
          setFormData({
            full_name: profile.full_name || '',
            role: profile.role || profile.title || '',
            years_of_experience: profile.years_of_experience ?? '',
            resume_drive_link: profile.resume_drive_link || '',
            bio: profile.bio || '',
            journey_text: profile.journey_text || '',
            email: profile.email || '',
            phone: profile.phone || '',
            location: profile.location || '',
            connect_message: profile.connect_message || '',
            github_username: profile.github_username || '',
            leetcode_username: profile.leetcode_username || '',
            codeforces_username: profile.codeforces_username || '',
            hero_image_url: profile.hero_image_url || profile.profile_image_url || '',
            icon_image_url: profile.icon_image_url || profile.profile_image_url || '',
            journey_image_url: profile.journey_image_url || '',
            favicon_url: profile.favicon_url || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();

    // Fetch existing admin credentials
    api.get('/admin/credentials')
      .then((res) => {
        setCredData((prev) => ({
          ...prev,
          username: res.data.username || '',
          email: res.data.email || '',
        }));
      })
      .catch(() => {});
  }, []);

  const isFieldChanged = (field) => {
    return (formData[field] ?? '') !== (initialData[field] ?? '');
  };

  const hasChanges = 
    Object.keys(formData).some(isFieldChanged) || 
    heroImage !== null || 
    iconImage !== null || 
    journeyImage !== null || 
    faviconImage !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSaving(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'hero_image_url' && key !== 'icon_image_url' && key !== 'journey_image_url' && key !== 'favicon_url') {
        data.append(key, formData[key] ?? '');
      }
    });
    if (heroImage) data.append('hero_image', heroImage);
    if (iconImage) data.append('icon_image', iconImage);
    if (journeyImage) data.append('journey_image', journeyImage);
    if (faviconImage) data.append('favicon_image', faviconImage);

    try {
      const res = await api.put('/admin/profile', data);
      setInitialData(res.data);
      setFormData({
        full_name: res.data.full_name || '',
        role: res.data.role || res.data.title || '',
        years_of_experience: res.data.years_of_experience ?? '',
        resume_drive_link: res.data.resume_drive_link || '',
        bio: res.data.bio || '',
        journey_text: res.data.journey_text || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        location: res.data.location || '',
        connect_message: res.data.connect_message || '',
        github_username: res.data.github_username || '',
        leetcode_username: res.data.leetcode_username || '',
        codeforces_username: res.data.codeforces_username || '',
        hero_image_url: res.data.hero_image_url || res.data.profile_image_url || '',
        icon_image_url: res.data.icon_image_url || res.data.profile_image_url || '',
        journey_image_url: res.data.journey_image_url || '',
        favicon_url: res.data.favicon_url || '',
      });
      setHeroImage(null);
      setIconImage(null);
      setJourneyImage(null);
      setFaviconImage(null);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to update profile.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setCredStatus(null);

    if (!credData.current_password) {
      setCredStatus({ type: 'error', text: 'Current password is required to save credentials.' });
      return;
    }

    if (credData.new_password) {
      if (credData.new_password.length < 6) {
        setCredStatus({ type: 'error', text: 'New password must be at least 6 characters long.' });
        return;
      }
      if (credData.new_password !== credData.confirm_password) {
        setCredStatus({ type: 'error', text: 'New password and Confirm Password do not match.' });
        return;
      }
    }

    setUpdatingCreds(true);
    try {
      const res = await api.put('/admin/credentials', credData);
      if (res.data.token) {
        useAuthStore.getState().login(res.data.token);
      }
      setCredStatus({ type: 'success', text: res.data.message || 'Credentials updated successfully!' });
      setCredData((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update credentials.';
      setCredStatus({ type: 'error', text: msg });
    } finally {
      setUpdatingCreds(false);
    }
  };

  const FieldLabel = ({ label, field }) => (
    <div className="flex items-center justify-between mb-1.5">
      <label className="admin-label mb-0">{label}</label>
      {isFieldChanged(field) && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
          Modified
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="admin-card p-6 md:p-8 space-y-10">
        
        {/* Section 1: Basic Identity & Role */}
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                1. Identity, Role & Experience
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure your primary display name, job role/title, and experience years.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <FieldLabel label="Full Name" field="full_name" />
              <input
                type="text"
                placeholder="Sakil Ahmed"
                className="admin-input"
                value={formData.full_name || ''}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="Role (Displayed below name)" field="role" />
              <input
                type="text"
                placeholder="e.g. Full Stack Developer"
                className="admin-input"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="Years of Experience" field="years_of_experience" />
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 3"
                className="admin-input"
                value={formData.years_of_experience}
                onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
              />
              <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                Overrides auto-calculated experience years if set
              </span>
            </div>
          </div>

          <div className="mt-6">
            <FieldLabel label="Resume Google Drive Link" field="resume_drive_link" />
            <div className="flex gap-3">
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                className="admin-input flex-1"
                value={formData.resume_drive_link || ''}
                onChange={(e) => setFormData({ ...formData, resume_drive_link: e.target.value })}
              />
              {formData.resume_drive_link && (
                <a
                  href={formData.resume_drive_link}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn-secondary shrink-0 inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test Link
                </a>
              )}
            </div>
            <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
              Direct link used for the navbar "CV" and hero "Download CV" buttons
            </span>
          </div>
        </div>

        {/* Section 2: Bio & Journey */}
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                2. Bio & Journey Narrative
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Configure your hero introduction and dedicated journey narrative.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <FieldLabel label="Short Bio (Hero Section)" field="bio" />
              <textarea
                placeholder="A concise, engaging summary about who you are..."
                rows={3}
                className="admin-input"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="My Journey (Detailed Section)" field="journey_text" />
              <textarea
                placeholder="Detailed backstory, transitions, highlights..."
                rows={5}
                className="admin-input font-sans text-sm"
                value={formData.journey_text || ''}
                onChange={(e) => setFormData({ ...formData, journey_text: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact Information */}
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                3. Contact Information & Availability
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Displayed publicly in the contact footer and hero badges.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <FieldLabel label="Public Email Address" field="email" />
              <input
                type="email"
                placeholder="you@domain.com"
                className="admin-input"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="Phone Number" field="phone" />
              <input
                type="text"
                placeholder="+1 234 567 890"
                className="admin-input"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="Location" field="location" />
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                className="admin-input"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6">
            <FieldLabel label="Let's Connect Section Message / Availability Tagline" field="connect_message" />
            <input
              type="text"
              placeholder="e.g. Currently open to freelance opportunities and full-time senior roles."
              className="admin-input"
              value={formData.connect_message || ''}
              onChange={(e) => setFormData({ ...formData, connect_message: e.target.value })}
            />
            <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
              One-line message displayed prominently under the "Let's Connect" section title on the public site.
            </span>
          </div>
        </div>

        {/* Section 4: Developer Platform Handles */}
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                4. Platform Integrations (Stats API)
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Enter usernames to dynamically pull live stats on the public site.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <FieldLabel label="GitHub Username" field="github_username" />
              <input
                type="text"
                placeholder="github-handle"
                className="admin-input"
                value={formData.github_username || ''}
                onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="LeetCode Username" field="leetcode_username" />
              <input
                type="text"
                placeholder="leetcode-handle"
                className="admin-input"
                value={formData.leetcode_username || ''}
                onChange={(e) => setFormData({ ...formData, leetcode_username: e.target.value })}
              />
            </div>

            <div>
              <FieldLabel label="Codeforces Username" field="codeforces_username" />
              <input
                type="text"
                placeholder="codeforces-handle"
                className="admin-input"
                value={formData.codeforces_username || ''}
                onChange={(e) => setFormData({ ...formData, codeforces_username: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-teal-300">
              <Activity className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Need to re-fetch live data, inspect diagnostic errors, or override stats?</span>
            </div>
            <Link
              to="/admin/stats"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-400 text-slate-900 hover:bg-teal-300 transition whitespace-nowrap"
            >
              Open Platform Stats Studio →
            </Link>
          </div>
        </div>

        {/* Section 5: Separate Photos */}
        <div>
          <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                5. Profile Visuals & Custom Favicon
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Upload dedicated visuals: large hero portrait, small navbar brand avatar, 3D journey artwork, and browser tab favicon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Hero Section Large Image */}
            <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="admin-label mb-0">Hero Main Photo</label>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Large portrait in Hero</p>
                  </div>
                  {heroImage && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-400">Selected</span>}
                </div>

                <div className="flex items-center gap-3">
                  <label className="admin-btn-secondary cursor-pointer">
                    <ImageIcon className="w-4 h-4 mr-1 text-teal-400" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setHeroImage(e.target.files[0])}
                      accept="image/*"
                    />
                  </label>
                  <span className="text-xs font-mono truncate max-w-[110px]" style={{ color: 'var(--text-muted)' }}>
                    {heroImage ? heroImage.name : formData.hero_image_url ? 'On file' : 'None'}
                  </span>
                </div>
              </div>

              {formData.hero_image_url && !heroImage && (
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                  <img
                    src={formData.hero_image_url}
                    alt="Hero Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-teal-500/30 shadow"
                  />
                  <a
                    href={formData.hero_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                </div>
              )}
            </div>

            {/* 2. Navbar Small Icon */}
            <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="admin-label mb-0">Navbar Icon</label>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Brand icon in Navbar/Footer</p>
                  </div>
                  {iconImage && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-400">Selected</span>}
                </div>

                <div className="flex items-center gap-3">
                  <label className="admin-btn-secondary cursor-pointer">
                    <ImageIcon className="w-4 h-4 mr-1 text-cyan-400" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setIconImage(e.target.files[0])}
                      accept="image/*"
                    />
                  </label>
                  <span className="text-xs font-mono truncate max-w-[110px]" style={{ color: 'var(--text-muted)' }}>
                    {iconImage ? iconImage.name : formData.icon_image_url ? 'On file' : 'None'}
                  </span>
                </div>
              </div>

              {formData.icon_image_url && !iconImage && (
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                  <img
                    src={formData.icon_image_url}
                    alt="Navbar Icon Preview"
                    className="w-10 h-10 object-cover rounded-lg border border-cyan-500/30 shadow"
                  />
                  <a
                    href={formData.icon_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                  >
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                </div>
              )}
            </div>

            {/* 3. Journey Section Artwork */}
            <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="admin-label mb-0">Journey Artwork</label>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Custom 3D graphic</p>
                  </div>
                  {journeyImage && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-400">Selected</span>}
                </div>

                <div className="flex items-center gap-3">
                  <label className="admin-btn-secondary cursor-pointer">
                    <ImageIcon className="w-4 h-4 mr-1 text-purple-400" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setJourneyImage(e.target.files[0])}
                      accept="image/*"
                    />
                  </label>
                  <span className="text-xs font-mono truncate max-w-[110px]" style={{ color: 'var(--text-muted)' }}>
                    {journeyImage ? journeyImage.name : formData.journey_image_url ? 'On file' : 'Default active'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                <img
                  src={formData.journey_image_url || '/assets/glowing_programmer.jpg'}
                  alt="Journey Artwork"
                  className="w-10 h-10 object-cover rounded-lg border border-purple-500/30 shadow"
                />
                <a
                  href={formData.journey_image_url || '/assets/glowing_programmer.jpg'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <ExternalLink className="w-3 h-3" /> View
                </a>
              </div>
            </div>

            {/* 4. Website Browser Tab Favicon */}
            <div className="p-5 rounded-2xl border flex flex-col justify-between" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="admin-label mb-0">Tab Favicon</label>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Custom browser tab icon</p>
                  </div>
                  {faviconImage && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-400">Selected</span>}
                </div>

                <div className="flex items-center gap-3">
                  <label className="admin-btn-secondary cursor-pointer">
                    <Globe className="w-4 h-4 mr-1 text-blue-400" />
                    <span>Choose Favicon</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFaviconImage(e.target.files[0])}
                      accept="image/x-icon,image/png,image/svg+xml,image/jpeg"
                    />
                  </label>
                  <span className="text-xs font-mono truncate max-w-[110px]" style={{ color: 'var(--text-muted)' }}>
                    {faviconImage ? faviconImage.name : formData.favicon_url ? 'On file' : 'Default favicon'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                <img
                  src={formData.favicon_url || formData.icon_image_url || '/favicon.png'}
                  alt="Favicon"
                  className="w-8 h-8 object-contain rounded-md border border-white/10 p-1 bg-white/5 shadow"
                />
                <a
                  href={formData.favicon_url || formData.icon_image_url || '/favicon.png'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <ExternalLink className="w-3 h-3" /> View
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <div className="pt-6 border-t flex items-center justify-between animate-in fade-in duration-300" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              You have unsaved changes
            </span>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary px-8 py-3 text-sm font-bold shadow-lg"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        )}
      </form>

      {/* Section 6: Account Security & Login Credentials Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Account Security & Admin Credentials
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Update your admin login username, recovery notification email, and password.
            </p>
          </div>
        </div>

        {credStatus && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2.5 ${
              credStatus.type === 'success'
                ? 'bg-teal-500/10 border border-teal-500/30 text-teal-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            {credStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{credStatus.text}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Admin Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  className="admin-input"
                  value={credData.username}
                  onChange={(e) => setCredData({ ...credData, username: e.target.value })}
                />
              </div>
              <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                The username used at /admin/login420
              </span>
            </div>

            <div>
              <label className="admin-label">Notification / Recovery Email</label>
              <input
                type="email"
                placeholder="admin@yourdomain.com"
                className="admin-input"
                value={credData.email}
                onChange={(e) => setCredData({ ...credData, email: e.target.value })}
              />
              <span className="text-[11px] mt-1 block" style={{ color: 'var(--text-muted)' }}>
                Used for account identification and notifications
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface-hover)' }}>
            <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Lock className="w-4 h-4 text-teal-400" /> Password Change
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Enter your current password to authorize updates. Leave new password blank if keeping current password.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="admin-label">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="admin-input"
                  value={credData.current_password}
                  onChange={(e) => setCredData({ ...credData, current_password: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">New Password</label>
                <input
                  type="password"
                  placeholder="Leave empty to keep"
                  className="admin-input"
                  value={credData.new_password}
                  onChange={(e) => setCredData({ ...credData, new_password: e.target.value })}
                />
              </div>

              <div>
                <label className="admin-label">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="admin-input"
                  value={credData.confirm_password}
                  onChange={(e) => setCredData({ ...credData, confirm_password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <button
              type="submit"
              disabled={updatingCreds}
              className="admin-btn-primary"
            >
              <KeyRound className="w-4 h-4 mr-1.5" />
              {updatingCreds ? 'Updating Credentials...' : 'Save Account Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManager;
