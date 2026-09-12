import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  Activity,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Code2,
  ExternalLink,
  Plus,
  Trash2,
  Key,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';

const PlatformStatsManager = () => {
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingPlatform, setSyncingPlatform] = useState({ github: false, leetcode: false, codeforces: false });
  const [saveSuccess, setSaveSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Form State
  const [githubUser, setGithubUser] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [codeforcesUser, setCodeforcesUser] = useState('');

  const [githubData, setGithubData] = useState({
    username: '',
    followers: 0,
    following: 0,
    public_repos: 0,
    starred_repos: 0,
    commits: 0,
    prs_issues: 0,
    html_url: '',
    top_repos: []
  });

  const [leetcodeData, setLeetcodeData] = useState({
    username: '',
    solvedProblem: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0
  });

  const [codeforcesData, setCodeforcesData] = useState({
    username: '',
    rating: 0,
    maxRating: 0,
    rank: 'unranked',
    maxRank: 'unranked',
    contribution: 0
  });

  const [syncStatus, setSyncStatus] = useState({});
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Load existing configuration & cached stats
  const fetchCurrentStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      const d = res.data;
      if (d) {
        setGithubUser(d.github_username || '');
        setGithubToken(d.github_token || '');
        setLeetcodeUser(d.leetcode_username || '');
        setCodeforcesUser(d.codeforces_username || '');

        if (d.github_data) setGithubData(d.github_data);
        if (d.leetcode_data) setLeetcodeData(d.leetcode_data);
        if (d.codeforces_data) setCodeforcesData(d.codeforces_data);

        setSyncStatus(d.sync_status || {});
        setLastSyncedAt(d.last_synced_at);
      }
    } catch (err) {
      console.error('Error fetching admin stats config:', err);
      setGeneralError('Failed to load stats configuration from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentStats();
  }, []);

  // Save everything to Database
  const handleSaveToDatabase = async () => {
    try {
      setGeneralError('');
      setSaveSuccess('');

      const payload = {
        github_username: githubUser,
        github_token: githubToken,
        github_data: githubData,
        leetcode_username: leetcodeUser,
        leetcode_data: leetcodeData,
        codeforces_username: codeforcesUser,
        codeforces_data: codeforcesData,
        sync_status: syncStatus
      };

      const res = await api.put('/admin/stats', payload);
      setLastSyncedAt(res.data?.stats?.last_synced_at || new Date().toISOString());
      setSaveSuccess('Platform stats successfully saved to database! Public portfolio is now updated.');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      console.error(err);
      setGeneralError(err.response?.data?.message || 'Failed to save stats to database.');
    }
  };

  // Live Fetch Handler for a single platform or all
  const handleFetch = async (targetPlatforms = ['github', 'leetcode', 'codeforces']) => {
    const isAll = targetPlatforms.length === 3;
    if (isAll) setSyncingAll(true);
    else {
      setSyncingPlatform(prev => ({ ...prev, [targetPlatforms[0]]: true }));
    }
    setGeneralError('');
    setSaveSuccess('');

    try {
      const res = await api.post('/admin/stats/fetch', {
        platforms: targetPlatforms,
        github_username: githubUser,
        github_token: githubToken,
        leetcode_username: leetcodeUser,
        codeforces_username: codeforcesUser,
        auto_save: false
      });

      const { results, sync_status } = res.data;

      if (results.github) {
        setGithubData(prev => ({
          ...prev,
          ...results.github,
          top_repos: results.github.top_repos?.length > 0 ? results.github.top_repos : prev.top_repos
        }));
      }

      if (results.leetcode) {
        setLeetcodeData(prev => ({ ...prev, ...results.leetcode }));
      }

      if (results.codeforces) {
        setCodeforcesData(prev => ({ ...prev, ...results.codeforces }));
      }

      setSyncStatus(prev => ({ ...prev, ...sync_status }));

      // Check if any error occurred
      const failed = Object.entries(sync_status).filter(([_, s]) => !s.ok);
      if (failed.length > 0) {
        setGeneralError(`Notice: ${failed.map(([k, s]) => `${k.toUpperCase()}: ${s.message}`).join(' | ')}`);
      } else {
        setSaveSuccess('Data fetched successfully! Review the values below and click "Save to Database" to publish.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setGeneralError(err.response?.data?.message || 'Failed to fetch platform data.');
    } finally {
      if (isAll) setSyncingAll(false);
      else {
        setSyncingPlatform(prev => ({ ...prev, [targetPlatforms[0]]: false }));
      }
    }
  };

  // Top Repos Editing Helpers
  const handleAddRepo = () => {
    setGithubData(prev => ({
      ...prev,
      top_repos: [
        ...(prev.top_repos || []),
        {
          full_name: `${githubUser || 'user'}/new-repo`,
          contributions: 30,
          stars: 0,
          url: `https://github.com/${githubUser || ''}`
        }
      ]
    }));
  };

  const handleUpdateRepo = (index, field, value) => {
    const updated = [...(githubData.top_repos || [])];
    updated[index] = { ...updated[index], [field]: value };
    setGithubData(prev => ({ ...prev, top_repos: updated }));
  };

  const handleRemoveRepo = (index) => {
    const updated = [...(githubData.top_repos || [])];
    updated.splice(index, 1);
    setGithubData(prev => ({ ...prev, top_repos: updated }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin mb-4" />
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading Platform Stats Configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Platform & Coding Stats Manager
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Fetch live metrics from GitHub, LeetCode, and Codeforces, preview data with error handling, and save directly to your database.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastSyncedAt && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Last Synced: {new Date(lastSyncedAt).toLocaleString()}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleFetch(['github', 'leetcode', 'codeforces'])}
              disabled={syncingAll}
              className="admin-btn-secondary inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncingAll ? 'animate-spin text-teal-400' : ''}`} />
              <span>{syncingAll ? 'Syncing All...' : 'Fetch All Platforms'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToDatabase}
              className="admin-btn-primary inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save to Database</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {saveSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {generalError && (
          <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-3 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}
      </div>

      {/* 1. GitHub Card */}
      <div className="admin-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <GithubIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                GitHub Contribution & Repositories
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Controls heatmap profile, follower metrics, and highlighted open source repositories.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFetch(['github'])}
            disabled={syncingPlatform.github}
            className="admin-btn-secondary text-xs inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingPlatform.github ? 'animate-spin text-teal-400' : ''}`} />
            <span>{syncingPlatform.github ? 'Fetching GitHub...' : 'Fetch GitHub'}</span>
          </button>
        </div>

        {/* Sync Status Banner */}
        {syncStatus.github && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
            syncStatus.github.ok
              ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            {syncStatus.github.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span>{syncStatus.github.message}</span>
          </div>
        )}

        {/* Credentials Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
              GitHub Username
            </label>
            <input
              type="text"
              placeholder="e.g. protik0939 or ahmed-sakil"
              className="admin-input"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-teal-400" />
                Personal Access Token (Optional)
              </span>
              <span className="text-[10px] text-gray-400 lowercase">bypasses 60 req/hr limit</span>
            </label>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="admin-input"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
          </div>
        </div>

        {/* Editable Stats Grid */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-teal-400">
            Preview & Manual Overrides (GitHub Metrics)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Followers</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.followers ?? 0}
                onChange={(e) => setGithubData({ ...githubData, followers: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Following</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.following ?? 0}
                onChange={(e) => setGithubData({ ...githubData, following: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Public Repos</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.public_repos ?? 0}
                onChange={(e) => setGithubData({ ...githubData, public_repos: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Starred Repos</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.starred_repos ?? 0}
                onChange={(e) => setGithubData({ ...githubData, starred_repos: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">Total Commits</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.commits ?? 0}
                onChange={(e) => setGithubData({ ...githubData, commits: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 block mb-1">PRs & Issues</span>
              <input
                type="number"
                className="admin-input text-center font-bold"
                value={githubData.prs_issues ?? 0}
                onChange={(e) => setGithubData({ ...githubData, prs_issues: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Top Repositories Manager */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Featured Top Repositories ({githubData.top_repos?.length || 0})
            </h4>
            <button
              type="button"
              onClick={handleAddRepo}
              className="text-xs px-2.5 py-1 rounded-lg border border-teal-400/30 text-teal-400 hover:bg-teal-400/10 transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Repo</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(githubData.top_repos || []).map((repo, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="text"
                  placeholder="username/repository-name"
                  className="admin-input text-xs sm:w-1/3"
                  value={repo.full_name || ''}
                  onChange={(e) => handleUpdateRepo(idx, 'full_name', e.target.value)}
                />
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-gray-400">Stars:</span>
                    <input
                      type="number"
                      className="admin-input text-xs w-16 text-center"
                      value={repo.stars ?? 0}
                      onChange={(e) => handleUpdateRepo(idx, 'stars', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-gray-400">Contribs:</span>
                    <input
                      type="number"
                      className="admin-input text-xs w-16 text-center"
                      value={repo.contributions ?? 0}
                      onChange={(e) => handleUpdateRepo(idx, 'contributions', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    className="admin-input text-xs flex-1"
                    value={repo.url || ''}
                    onChange={(e) => handleUpdateRepo(idx, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRepo(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Remove Repository"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LeetCode Card */}
      <div className="admin-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                LeetCode Problem Solving
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Fetched directly using official LeetCode GraphQL with automatic secondary fallback.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFetch(['leetcode'])}
            disabled={syncingPlatform.leetcode}
            className="admin-btn-secondary text-xs inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingPlatform.leetcode ? 'animate-spin text-yellow-400' : ''}`} />
            <span>{syncingPlatform.leetcode ? 'Fetching LeetCode...' : 'Fetch LeetCode'}</span>
          </button>
        </div>

        {/* Sync Status Banner */}
        {syncStatus.leetcode && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
            syncStatus.leetcode.ok
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {syncStatus.leetcode.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{syncStatus.leetcode.message}</span>
          </div>
        )}

        {/* Username */}
        <div className="max-w-md">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            LeetCode Username / Handle
          </label>
          <input
            type="text"
            placeholder="e.g. sakil"
            className="admin-input"
            value={leetcodeUser}
            onChange={(e) => setLeetcodeUser(e.target.value)}
          />
        </div>

        {/* Editable Stats */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-yellow-400">
            Preview & Manual Overrides (Solved Problems)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs text-gray-400 block mb-1">Total Solved</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-white"
                value={leetcodeData.solvedProblem ?? 0}
                onChange={(e) => setLeetcodeData({ ...leetcodeData, solvedProblem: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 text-center">
              <span className="text-xs text-teal-400 block mb-1">Easy Solved</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-teal-300"
                value={leetcodeData.easySolved ?? 0}
                onChange={(e) => setLeetcodeData({ ...leetcodeData, easySolved: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-center">
              <span className="text-xs text-yellow-400 block mb-1">Medium Solved</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-yellow-300"
                value={leetcodeData.mediumSolved ?? 0}
                onChange={(e) => setLeetcodeData({ ...leetcodeData, mediumSolved: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 text-center">
              <span className="text-xs text-rose-400 block mb-1">Hard Solved</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-rose-300"
                value={leetcodeData.hardSolved ?? 0}
                onChange={(e) => setLeetcodeData({ ...leetcodeData, hardSolved: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Codeforces Card */}
      <div className="admin-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Codeforces Competitive Programming
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Pulls rating, title rank (Specialist, Expert, Candidate Master), and contest track record.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFetch(['codeforces'])}
            disabled={syncingPlatform.codeforces}
            className="admin-btn-secondary text-xs inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingPlatform.codeforces ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{syncingPlatform.codeforces ? 'Fetching Codeforces...' : 'Fetch Codeforces'}</span>
          </button>
        </div>

        {/* Sync Status Banner */}
        {syncStatus.codeforces && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
            syncStatus.codeforces.ok
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {syncStatus.codeforces.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{syncStatus.codeforces.message}</span>
          </div>
        )}

        {/* Username */}
        <div className="max-w-md">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            Codeforces Handle
          </label>
          <input
            type="text"
            placeholder="e.g. sakil or saKIL"
            className="admin-input"
            value={codeforcesUser}
            onChange={(e) => setCodeforcesUser(e.target.value)}
          />
        </div>

        {/* Editable Stats */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-cyan-400">
            Preview & Manual Overrides (Rating & Rank)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-xs text-gray-400 block mb-1">Current Rating</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-white"
                value={codeforcesData.rating ?? 0}
                onChange={(e) => setCodeforcesData({ ...codeforcesData, rating: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Max Rating</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-white"
                value={codeforcesData.maxRating ?? 0}
                onChange={(e) => setCodeforcesData({ ...codeforcesData, maxRating: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Current Rank</span>
              <input
                type="text"
                className="admin-input text-center text-sm font-semibold capitalize text-cyan-300"
                value={codeforcesData.rank || ''}
                onChange={(e) => setCodeforcesData({ ...codeforcesData, rank: e.target.value })}
              />
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Max Rank</span>
              <input
                type="text"
                className="admin-input text-center text-sm font-semibold capitalize text-cyan-300"
                value={codeforcesData.maxRank || ''}
                onChange={(e) => setCodeforcesData({ ...codeforcesData, maxRank: e.target.value })}
              />
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1">Contribution</span>
              <input
                type="number"
                className="admin-input text-center text-lg font-bold text-white"
                value={codeforcesData.contribution ?? 0}
                onChange={(e) => setCodeforcesData({ ...codeforcesData, contribution: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="admin-card p-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Tip: Remember to click <span className="text-teal-400 font-semibold">"Save to Database"</span> to persist any changes to the public portfolio.
        </p>
        <button
          type="button"
          onClick={handleSaveToDatabase}
          className="admin-btn-primary inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save to Database</span>
        </button>
      </div>
    </div>
  );
};

export default PlatformStatsManager;
