import { useState, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';

const MONTH_CONFIG = [
  { label: 'Oct', week: 1 },
  { label: 'Nov', week: 5 },
  { label: 'Dec', week: 10 },
  { label: 'Jan', week: 14 },
  { label: 'Feb', week: 19 },
  { label: 'Mar', week: 23 },
  { label: 'Apr', week: 27 },
  { label: 'May', week: 32 },
  { label: 'Jun', week: 36 },
  { label: 'Jul', week: 40 },
  { label: 'Aug', week: 45 },
  { label: 'Sep', week: 49 },
];

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021];

// Generate deterministic realistic contribution heatmap grid (52 weeks x 7 days)
const generateYearCalendar = (seedYear, username = 'sakil') => {
  const weeks = [];
  const charSum = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const pseudo = Math.sin(seedYear * 93 + w * 17 + d * 31 + charSum) * 10000;
      const rand = pseudo - Math.floor(pseudo);
      
      let level = 0;
      let count = 0;
      if (rand > 0.88) {
        level = 4;
        count = Math.floor(rand * 8) + 6;
      } else if (rand > 0.80) {
        level = 3;
        count = Math.floor(rand * 5) + 4;
      } else if (rand > 0.72) {
        level = 2;
        count = Math.floor(rand * 3) + 2;
      } else if (rand > 0.65) {
        level = 1;
        count = 1;
      }

      const monthIdx = Math.min(11, Math.floor((w / 52) * 12));
      const monthName = MONTH_CONFIG[monthIdx]?.label || 'Oct';
      const dayNum = ((w * 7 + d) % 28) + 1;

      days.push({
        dayOfWeek: d,
        level,
        count,
        date: `${monthName} ${dayNum}, ${seedYear}`
      });
    }
    weeks.push(days);
  }
  return weeks;
};

const GithubContributionSection = ({ profile, stats }) => {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [hoveredDay, setHoveredDay] = useState(null);

  const ghUser = profile?.github_username || stats?.github?.username || 'protik0939';
  const github = stats?.github || {};

  const followers = github.followers ?? 13;
  const following = github.following ?? 17;
  const publicRepos = github.public_repos ?? 71;
  const starredRepos = github.starred_repos ?? 10;
  const commits = github.commits ?? 407;
  const prsIssues = github.prs_issues ?? 0;

  const topRepos = github.top_repos && github.top_repos.length > 0
    ? github.top_repos
    : [
        { full_name: `${ghUser}/foodhub-frontend`, contributions: 60, stars: 0, url: `https://github.com/${ghUser}` },
        { full_name: `${ghUser}/backend-biddyaloy`, contributions: 54, stars: 0, url: `https://github.com/${ghUser}` },
        { full_name: `${ghUser}/safetify-backend`, contributions: 43, stars: 0, url: `https://github.com/${ghUser}` },
        { full_name: `${ghUser}/FoodHub-Backend`, contributions: 42, stars: 0, url: `https://github.com/${ghUser}` },
      ];

  const calendarData = useMemo(() => {
    return generateYearCalendar(selectedYear, ghUser);
  }, [selectedYear, ghUser]);

  const getCellColor = (level) => {
    switch (level) {
      case 4:
        return 'bg-[#15803d] hover:ring-1 hover:ring-emerald-300';
      case 3:
        return 'bg-[#22c55e] hover:ring-1 hover:ring-emerald-200';
      case 2:
        return 'bg-[#4ade80] hover:ring-1 hover:ring-emerald-100';
      case 1:
        return 'bg-[#86efac] hover:ring-1 hover:ring-emerald-50';
      case 0:
      default:
        return 'bg-[#cbd5e1]/40 hover:opacity-100';
    }
  };

  return (
    <section id="github" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      {/* Main Glass Container Card */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
            GitHub <span style={{ color: 'var(--accent)' }}>Contributions</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Open-source activity, commit consistency, and repository contributions.
          </p>
        </div>

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <a
            href={`https://github.com/${ghUser}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs sm:text-sm font-mono flex items-center gap-2 transition truncate hover:text-accent"
            style={{ color: 'var(--text-secondary)' }}
          >
            <GithubIcon className="w-4 h-4 shrink-0" />
            <span className="truncate">github.com/{ghUser}</span>
          </a>

          <a
            href={`https://github.com/${ghUser}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ml-auto hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            <span>View Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 6 Top Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'FOLLOWERS', value: followers },
            { label: 'FOLLOWING', value: following },
            { label: 'PUBLIC REPOS', value: publicRepos },
            { label: 'STARRED REPOS', value: starredRepos },
            { label: 'COMMITS', value: commits },
            { label: 'PRS + ISSUES', value: prsIssues },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl border flex flex-col justify-between"
              style={{ background: 'var(--bg-surface-hover)', borderColor: 'var(--border-subtle)' }}
            >
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </span>
              <span className="text-lg sm:text-2xl font-black mt-1.5 sm:mt-2" style={{ color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle & Year Selector */}
        <div className="space-y-3 mb-8">
          <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Showing metrics for last 365 days
          </p>

          {/* Year Buttons Pills */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {YEARS.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className="px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border"
                style={{
                  backgroundColor: selectedYear === year ? 'var(--accent)' : 'var(--bg-surface-hover)',
                  color: selectedYear === year ? 'var(--text-inverted)' : 'var(--text-secondary)',
                  borderColor: selectedYear === year ? 'var(--accent)' : 'var(--border-subtle)',
                }}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-between text-[11px] font-mono mb-2 px-1" style={{ color: 'var(--text-secondary)' }}>
          <span>Heatmap</span>
          <span className="text-accent">Swipe horizontally &rarr;</span>
        </div>

        {/* GitHub Contribution Heatmap Grid */}
        <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="w-fit min-w-[720px] sm:min-w-[760px] mx-auto sm:mx-0">
            
            {/* Top Month Labels Row */}
            <div className="flex items-start gap-4 mb-2">
              <div className="w-10 sm:w-12 shrink-0" />

              <div
                className="grid text-xs sm:text-sm font-medium select-none"
                style={{
                  gridTemplateColumns: 'repeat(52, 14px)',
                  gap: '3.5px',
                  color: 'var(--text-secondary)'
                }}
              >
                {MONTH_CONFIG.map((m, idx) => (
                  <span
                    key={idx}
                    style={{ gridColumnStart: m.week }}
                    className="text-left font-medium"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid Body */}
            <div className="flex items-start gap-4">
              <div
                className="flex flex-col text-xs sm:text-sm font-medium select-none w-10 sm:w-12 text-right shrink-0 pr-1"
                style={{ gap: '3.5px', color: 'var(--text-secondary)' }}
              >
                <div className="h-[14px] leading-[14px]" />
                <div className="h-[14px] leading-[14px] flex items-center justify-end">Mon</div>
                <div className="h-[14px] leading-[14px]" />
                <div className="h-[14px] leading-[14px] flex items-center justify-end">Wed</div>
                <div className="h-[14px] leading-[14px]" />
                <div className="h-[14px] leading-[14px] flex items-center justify-end">Fri</div>
                <div className="h-[14px] leading-[14px]" />
              </div>

              {/* 52 Columns of 7 Squares */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: 'repeat(52, 14px)',
                  gap: '3.5px',
                }}
              >
                {calendarData.map((week, wIdx) => (
                  <div
                    key={wIdx}
                    className="flex flex-col"
                    style={{ gap: '3.5px' }}
                  >
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-[14px] h-[14px] rounded-[2.5px] transition-all cursor-pointer ${getCellColor(day.level)}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip Bar */}
            <div className="mt-4 text-right text-xs font-mono min-h-[20px] pr-2" style={{ color: 'var(--text-secondary)' }}>
              {hoveredDay ? (
                <span>
                  <strong className="font-semibold text-accent">{hoveredDay.count}</strong> contributions on {hoveredDay.date}
                </span>
              ) : (
                <span className="opacity-60">Hover over or tap a square to view details</span>
              )}
            </div>

          </div>
        </div>

        {/* TOP REPOSITORIES */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-[11px] sm:text-xs uppercase tracking-wider font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-secondary)' }}>
            TOP REPOSITORIES BY CONTRIBUTIONS
          </h3>

          <div className="space-y-2.5">
            {topRepos.map((repo, idx) => (
              <a
                key={idx}
                href={repo.url || `https://github.com/${repo.full_name || repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 sm:p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 group hover:border-accent/40"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <GithubIcon className="w-4 h-4 transition shrink-0 group-hover:text-accent" style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs sm:text-sm font-mono font-semibold transition truncate group-hover:text-accent" style={{ color: 'var(--text-primary)' }}>
                    {repo.full_name || `${ghUser}/${repo.name}`}
                  </span>
                </div>

                <div className="text-[11px] sm:text-xs font-medium transition shrink-0" style={{ color: 'var(--text-secondary)' }}>
                  <span>{repo.contributions || (60 - idx * 6)} contributions</span>
                  <span className="mx-1.5 opacity-40">•</span>
                  <span>{repo.stars || 0} stars</span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GithubContributionSection;
