import React from 'react';
import { Terminal } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  order: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  isLoading?: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [], isLoading = false }) => {
  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  const renderSkillIcon = (icon?: string | null) => {
    return renderResolvedIcon(
      icon,
      <Terminal className="w-3.5 h-3.5 text-accent" />,
      "w-3.5 h-3.5 text-accent"
    );
  };

  return (
    <section id="skills" className="space-y-6 p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl glass-panel">
      {/* Coder-vibe Section Header */}
      <SectionHeader
        tag="//"
        title="SKILLS"
        subtitle="Languages, frameworks, database systems, and tools I use to build software."
      />

      {isLoading ? (
        <div className="p-8 rounded-lg glass-subcard text-center text-xs font-mono text-text-muted">
          Loading skills repository...
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 rounded-lg glass-subcard text-center text-xs font-mono text-text-muted space-y-1">
          <p className="text-text-main font-semibold">// NO_SKILLS_REGISTERED</p>
          <p className="text-[11px] text-text-muted">No technical skills found in the database.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            const formattedCategory = category.toUpperCase().replace(/\s+/g, '_');
            return (
              <div key={category} className="rounded-lg glass-subcard p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-text-main font-mono">// {formattedCategory}</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg glass-subcard-nested hover:border-accent/40 transition-all duration-150 group"
                    >
                      <div className="w-7 h-7 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-accent/40 transition-colors">
                        {renderSkillIcon(skill.icon)}
                      </div>
                      <span className="text-xs font-medium text-text-main truncate group-hover:text-accent transition-colors font-mono">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
