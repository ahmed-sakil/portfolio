import { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Database,
  Wrench,
  Code2,
  PenTool,
  Terminal,
  Layout,
  Sparkles,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  PROGRAMMING_LANGUAGE: { label: 'Programming Languages', icon: Code2, color: 'text-blue-400' },
  MARKUP_STYLING: { label: 'Markup/Styling', icon: Layout, color: 'text-pink-400' },
  DATABASE: { label: 'Databases', icon: Database, color: 'text-purple-400' },
  LIBRARY: { label: 'Libraries/Frameworks', icon: Layers, color: 'text-teal-400' },
  TOOL: { label: 'Tools', icon: Wrench, color: 'text-orange-400' },
  PLATFORM: { label: 'Platforms', icon: Terminal, color: 'text-green-400' },
  TECHNOLOGY: { label: 'Technologies', icon: Sparkles, color: 'text-yellow-400' },
  OTHER: { label: 'Others', icon: PenTool, color: 'text-gray-400' },
};

const groupSkillsByCategory = (skillsList) => {
  if (!skillsList) return {};
  return skillsList.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
};

const SkillsSection = ({ skills }) => {
  const grouped = groupSkillsByCategory(skills);
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
            Skills & <span style={{ color: 'var(--accent)' }}>Expertise</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Technologies, frameworks, and specialized tools I work with daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(grouped).map(([category, categorySkills]) => {
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
            const Icon = config.icon;
            return (
              <div
                key={category}
                className="rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(0,229,160,0.18)] transition-all duration-300"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">{config.label}</h3>
                </div>

                <ul className="space-y-4">
                  {categorySkills.sort((a, b) => b.percentage - a.percentage).map((skill) => (
                    <li key={skill.id} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          {skill.icon_name ? (
                            <img
                              src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                              alt={skill.name}
                              className="w-4 h-4 opacity-80 group-hover:opacity-100 transition"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[9px] text-teal-400 font-bold">
                              {skill.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-medium text-teal-400">
                          {skill.percentage}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,229,160,0.4)]"
                          style={{ width: animated ? `${skill.percentage}%` : '0%' }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
