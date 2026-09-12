import { Code2, Terminal, ExternalLink, Trophy, CheckCircle2, Zap } from 'lucide-react';

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


  return (
    <section id="problem-solving" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
            Problem Solving <span style={{ color: 'var(--accent)' }}>Skill</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Track record on competitive programming platforms, algorithmic challenges, and data structures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
          {/* Card 1: LeetCode (Col 7) */}
          <div className="lg:col-span-7 inner-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 sm:space-y-6" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              {/* Platform Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--bg-surface-hover)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent)'
                    }}
                  >
                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span>LeetCode</span>
                      <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full border" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        @{lcUser}
                      </span>
                    </h3>
                    <span className="text-[11px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>Algorithm & Data Structure Drills</span>
                  </div>
                </div>

                <a
                  href={`https://leetcode.com/u/${lcUser}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ml-auto hover:border-accent"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent)'
                  }}
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Solved Problems Counter */}
              <div className="my-4 sm:my-6 flex items-baseline gap-2.5 sm:gap-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>{totalSolved}</span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Problems Solved
                </span>
              </div>

              {/* Difficulty Breakdown Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold block mb-0.5 sm:mb-1" style={{ color: 'var(--accent)' }}>
                    Easy
                  </span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{easySolved}</span>
                </div>

                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold block mb-0.5 sm:mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Medium
                  </span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{mediumSolved}</span>
                </div>

                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold block mb-0.5 sm:mb-1" style={{ color: 'var(--text-muted)' }}>
                    Hard
                  </span>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{hardSolved}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 text-[11px] sm:text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                Verified Submissions
              </span>
              <span>Focus: Dynamic Programming, Trees & Graphs</span>
            </div>
          </div>

          {/* Card 2: Codeforces (Col 5) */}
          <div className="lg:col-span-5 inner-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 sm:space-y-6" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              {/* Platform Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--bg-surface-hover)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--accent)'
                    }}
                  >
                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span>Codeforces</span>
                      <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full border" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        @{cfUser}
                      </span>
                    </h3>
                    <span className="text-[11px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>Competitive Programming Contests</span>
                  </div>
                </div>

                <a
                  href={`https://codeforces.com/profile/${cfUser}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ml-auto hover:border-accent"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--accent)'
                  }}
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Rating Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 my-4 sm:my-6">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center sm:text-left" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold block mb-0.5 sm:mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Current Rating
                  </span>
                  <span className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--accent)' }}>{cfRating}</span>
                </div>

                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center sm:text-left" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold block mb-0.5 sm:mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Max Rating
                  </span>
                  <span className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{cfMaxRating}</span>
                </div>
              </div>

              {/* Rank Status */}
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border space-y-2" style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current Rank:</span>
                  <span
                    className="text-[10px] sm:text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      borderColor: 'var(--accent-dim)',
                      backgroundColor: 'var(--accent-dim)',
                      color: 'var(--accent)'
                    }}
                  >
                    {cfRank}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max Rank:</span>
                  <span
                    className="text-[10px] sm:text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {cfMaxRank}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 text-[11px] sm:text-xs" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-accent shrink-0" />
                Rated Division Contests
              </span>
              <span>Online Judge Archive</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolvingSection;
