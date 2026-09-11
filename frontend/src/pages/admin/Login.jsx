import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { updatePageMeta } from '../../utils/pageMeta';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta({ title: 'Admin Login | Sakil Ahmed' });
    api.get('/portfolio').then((res) => {
      const fav = res.data?.profile?.favicon_url || res.data?.profile?.icon_image_url || '/favicon.svg';
      updatePageMeta({ faviconUrl: fav });
    }).catch(() => {});
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      <div className="admin-card p-8 md:p-10 w-full max-w-md shadow-2xl relative border border-white/10">
        
        {/* Lock Icon Badge */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-teal-400/10 border border-teal-400/30 text-teal-400 shadow-lg shadow-teal-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-center mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Portfolio Admin
        </h2>
        <p className="text-xs text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
          Enter your authorized credentials to manage portfolio data.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 text-center animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="admin-label">Username</label>
            <input
              type="text"
              placeholder="admin"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary w-full py-3.5 text-sm uppercase tracking-wider font-bold shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portfolio
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
