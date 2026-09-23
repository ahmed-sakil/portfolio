import { useState } from 'react';
import AppIcon from '../../../components/icons/AppIcon';

const CATEGORY_CONFIG = {
  PROGRAMMING_LANGUAGE: { label: 'Programming Languages' },
  LIBRARY: { label: 'Frontend & Frameworks' },
  DATABASE: { label: 'Databases & Storage' },
  TECHNOLOGY: { label: 'Backend & Architecture' },
  TOOL: { label: 'Tools & DevOps' },
  PLATFORM: { label: 'Platforms & Cloud' },
  MARKUP_STYLING: { label: 'Markup & Styling' },
  OTHER: { label: 'Other Technologies' },
};

// Desired display order for clean developer presentation
const CATEGORY_ORDER = [
  'TECHNOLOGY',
  'PROGRAMMING_LANGUAGE',
  'LIBRARY',
  'DATABASE',
  'TOOL',
  'PLATFORM',
  'MARKUP_STYLING',
  'OTHER'
];

const groupSkillsByCategory = (skillsList) => {
  if (!skillsList || !Array.isArray(skillsList)) return {};
  const visibleSkills = skillsList.filter((s) => s.is_featured !== false);
  return visibleSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

const SkillsSection = ({ skills }) => {
  const grouped = groupSkillsByCategory(skills);
  const [activeSkillId, setActiveSkillId] = useState(null);

  const handleSkillClick = (id) => {
    setActiveSkillId((prev) => (prev === id ? null : id));
  };

  // Sort categories by predefined order, but only include non-empty ones
  const availableCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length > 0);
  // Add any unlisted categories with items
  Object.keys(grouped).forEach((cat) => {
    if (!availableCategories.includes(cat) && grouped[cat]?.length > 0) {
      availableCategories.push(cat);
    }
  });

  return (
    <section id="skills" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden">
        
        {/* Section Header - Left-Aligned & Developer Typography */}
        <div className="mb-8 sm:mb-12 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Skills & <span style={{ color: 'var(--accent)' }}>Expertise</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>
            // Technologies, frameworks, and tools powering my daily workflow
          </p>
        </div>

        {/* Categories & Cards */}
        {availableCategories.length === 0 ? (
          <div className="py-12 text-center text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            // No public skills highlighted at this moment
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-14">
            {availableCategories.map((category) => {
              const config = CATEGORY_CONFIG[category] || { label: category };
              const categorySkills = grouped[category] || [];

              return (
                <div key={category} className="space-y-5">
                  {/* Category Header with Vertical Accent Pill Bar */}
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-1 h-5 sm:h-6 rounded-full inline-block shrink-0 transition-colors duration-300"
                      style={{ background: 'var(--accent)' }}
                    />
                    <h3 className="text-base sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      {config.label}
                    </h3>
                  </div>

                  {/* 5-Column Grid of Skill Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {categorySkills.map((skill) => {
                      const isSelected = activeSkillId === skill.id;

                      return (
                        <div
                          key={skill.id}
                          onClick={() => handleSkillClick(skill.id)}
                          className={`group relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border cursor-pointer select-none transition-all duration-200 ease-out flex flex-col items-center justify-center text-center gap-3 ${
                            isSelected
                              ? 'scale-[1.04] z-20'
                              : 'hover:scale-[1.02] hover:z-10'
                          }`}
                          style={{
                            background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                            borderColor: isSelected ? 'var(--accent)' : 'var(--border-card)',
                            boxShadow: isSelected 
                              ? '0 0 18px color-mix(in srgb, var(--accent) 30%, transparent), var(--shadow-card)' 
                              : 'var(--shadow-card)',
                            minHeight: '115px'
                          }}
                          title={`${skill.name} — Click to focus`}
                        >
                          {/* Center Icon */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
                            <AppIcon
                              iconUrl={skill.icon_url}
                              iconName={skill.icon_name}
                              iconType={skill.icon_type}
                              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                              alt={skill.name}
                              fallbackChar={skill.name?.charAt(0)}
                            />
                          </div>

                          {/* Center Name in Monospace */}
                          <span
                            className="font-mono text-xs sm:text-sm font-semibold tracking-wide truncate w-full px-1 transition-colors duration-200"
                            style={{
                              color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                            }}
                          >
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
