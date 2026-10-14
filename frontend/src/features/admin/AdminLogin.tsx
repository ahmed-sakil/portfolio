import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useDynamicHead } from '../../lib/useDynamicHead';

export const AdminLogin: React.FC = () => {
  useDynamicHead({ title: 'Admin Gate — Authentication Portal' });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiClient<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('portfolio_admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-3 text-accent">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-base font-bold tracking-tight">Admin Gate</h1>
          <p className="text-xs font-mono text-text-muted mt-1">Authorized personnel only</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-text-muted uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portfolio.local"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-text-muted uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-background font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[11px] font-mono text-text-muted hover:text-text-main transition-colors"
          >
            ← Return to portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
