import { Code2, Terminal, ExternalLink, Trophy, CheckCircle2, Zap } from 'lucide-react';
import SocialIcon from '../../../components/icons/SocialIcon';

const ProblemSolvingSection = ({ profile, stats }) => {
  const lcUser = profile?.leetcode_username || stats?.leetcode?.username || 'sakil';
  const cfUser = profile?.codeforces_username || stats?.codeforces?.username || 'sakil';

  const leetcode = stats?.leetcode || {};
  const codeforces = stats?.codeforces || {};

  const totalSolved = leetcode.solvedProblem ?? 285;
  const easySolved = leetcode.easySolved ?? 110;
  const mediumSolved = leetcode.mediumSolved ?? 145;
  const hardSolved = leetcode.hardSolved ?? 30;

  const cfRating = codeforces.rating ?? 1420;
  const cfMaxRating = codeforces.maxRating ?? 1510;
  const cfRank = codeforces.rank ?? 'specialist';
  const cfMaxRank = codeforces.maxRank ?? 'specialist';

  const getRankBadgeColor = (rank) => {
    const r = String(rank).toLowerCase();
    if (r.includes('master') || r.includes('grandmaster')) return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (r.includes('candidate')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (r.includes('expert')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (r.includes('specialist')) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  return (
    <section id="problem-solving" className="w-[90%] max-w-7xl mx-auto mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Problem Solving <span style={{ color: 'var(--accent)' }}>Skill</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Track record on competitive programming platforms, algorithmic challenges, and data structures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Card 1: LeetCode (Col 7) */}
        <div className="lg:col-span-7 glass-section rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Platform Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>LeetCode</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      @{lcUser}
                    </span>
                  </h3>
                  <span className="text-xs text-gray-400">Algorithm & Data Structure Drills</span>
                </div>
              </div>

              <a
                href={`https://leetcode.com/u/${lcUser}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-yellow-400/50 hover:bg-yellow-400/10 text-xs font-semibold text-yellow-400 transition"
              >
                <span>Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Solved Problems Counter */}
            <div className="my-6 flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-white">{totalSolved}</span>
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Problems Solved
              </span>
            </div>

            {/* Difficulty Breakdown Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5">
                <span className="text-xs font-bold text-emerald-400 block mb-1">Easy</span>
                <span className="text-2xl font-black text-white">{easySolved}</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${totalSolved > 0 ? Math.min(100, (easySolved / totalSolved) * 100) : 0}%` }} />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-amber-400/20 bg-amber-400/5">
                <span className="text-xs font-bold text-amber-400 block mb-1">Medium</span>
                <span className="text-2xl font-black text-white">{mediumSolved}</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${totalSolved > 0 ? Math.min(100, (mediumSolved / totalSolved) * 100) : 0}%` }} />
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl border border-rose-400/20 bg-rose-400/5">
                <span className="text-xs font-bold text-rose-400 block mb-1">Hard</span>
                <span className="text-2xl font-black text-white">{hardSolved}</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: `${totalSolved > 0 ? Math.min(100, (hardSolved / totalSolved) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              Verified Submissions
            </span>
            <span>Focus: Dynamic Programming, Trees & Graphs</span>
          </div>
        </div>

        {/* Card 2: Codeforces (Col 5) */}
        <div className="lg:col-span-5 glass-section rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Platform Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Codeforces</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                      @{cfUser}
                    </span>
                  </h3>
                  <span className="text-xs text-gray-400">Competitive Programming Contests</span>
                </div>
              </div>

              <a
                href={`https://codeforces.com/profile/${cfUser}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-blue-400/50 hover:bg-blue-400/10 text-xs font-semibold text-blue-400 transition"
              >
                <span>Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Rating Grid */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block mb-1">
                  Current Rating
                </span>
                <span className="text-3xl font-black text-cyan-400">{cfRating}</span>
              </div>

              <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block mb-1">
                  Max Rating
                </span>
                <span className="text-3xl font-black text-blue-400">{cfMaxRating}</span>
              </div>
            </div>

            {/* Rank Status */}
            <div className="p-4 rounded-2xl border border-white/5 bg-[#121826]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Current Rank:</span>
                <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${getRankBadgeColor(cfRank)}`}>
                  {cfRank}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Max Rank:</span>
                <span className={`text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${getRankBadgeColor(cfMaxRank)}`}>
                  {cfMaxRank}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Div 2 & Div 3 Regular Contestant
            </span>
            <span>Contest Rating</span>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolvingSection;
