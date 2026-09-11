import { Code2, Terminal } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';

const StatsSection = ({ stats }) => {
  return (
    <section id="stats" className="w-[90%] max-w-7xl mx-auto mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-section rounded-3xl p-8 md:p-14">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Competitive & Open Source
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
            Live stats fetched directly from developer platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.github && (
            <div
              className="p-6 rounded-2xl border border-white/10 text-center hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(0,229,160,0.18)] transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-teal-400">
                <GithubIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Repositories: <span className="text-teal-400 font-bold">{stats.github.public_repos}</span>
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Followers: <span className="text-teal-400 font-bold">{stats.github.followers}</span>
              </p>
            </div>
          )}

          {stats?.leetcode && (
            <div
              className="p-6 rounded-2xl border border-white/10 text-center hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.18)] transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-yellow-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">LeetCode</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Solved: <span className="text-yellow-400 font-bold">{stats.leetcode.solvedProblem} problems</span>
              </p>
            </div>
          )}

          {stats?.codeforces && (
            <div
              className="p-6 rounded-2xl border border-white/10 text-center hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(96,165,250,0.18)] transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-blue-400">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Codeforces</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Rating: <span className="text-blue-400 font-bold">{stats.codeforces.rating}</span>
              </p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Rank: <span className="text-blue-400 font-bold">{stats.codeforces.rank}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
