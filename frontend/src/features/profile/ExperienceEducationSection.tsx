import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, Building, School } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  logoUrl?: string | null;
  description?: string | null;
  order: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  grade?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  order: number;
}

interface ExperienceEducationSectionProps {
  experiences: ExperienceItem[];
  educations: EducationItem[];
}

export const ExperienceEducationSection: React.FC<ExperienceEducationSectionProps> = ({
  experiences = [],
  educations = [],
}) => {
  return (
    <section id="experience" className="space-y-8 p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl glass-panel">
      {/* Coder-vibe Section Header with barcode line */}
      <SectionHeader
        tag="//"
        title="EXPERIENCE & ACADEMIA"
        subtitle="My professional work history and formal education."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Commercial Experience */}
        <div className="rounded-lg glass-subcard p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-1 border-b border-border/50">
            <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main font-mono">// INDUSTRY_EXPERIENCE</h3>
          </div>

          <div className="space-y-3">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 sm:p-5 rounded-lg glass-subcard-nested hover:border-accent/40 transition-all duration-150 group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Column: Rows of Company, Role, Description, Timeline & Status */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row 1: Company (highlighted) */}
                    <h4 className="text-sm sm:text-base font-bold text-text-main font-mono group-hover:text-accent transition-colors leading-snug">
                      {exp.company}
                    </h4>

                    {/* Row 2: Role / Position */}
                    <div className="text-xs sm:text-sm font-semibold text-text-muted">
                      {exp.role}
                    </div>

                    {/* Row 3: Description / Highlights */}
                    {exp.description && (
                      <p className="text-xs text-text-muted leading-relaxed font-mono pt-0.5">
                        {exp.description}
                      </p>
                    )}

                    {/* Row 4: Timeline & Location + Status Badge on corner */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/40 text-[11px] font-mono text-text-muted">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')}</span>
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-text-muted" />
                            <span>{exp.location}</span>
                          </span>
                        )}
                      </div>

                      {exp.current && (
                        <span className="px-3 py-1 rounded-md bg-accent text-background font-mono text-[10px] font-bold uppercase shadow-xs">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Company Logo / Image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-accent flex-shrink-0 group-hover:border-accent/40 transition-colors overflow-hidden shadow-xs">
                    {exp.logoUrl ? (
                      <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-6 h-6 text-accent" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Formal Education */}
        <div className="rounded-lg glass-subcard p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-1 border-b border-border/50">
            <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main font-mono">// ACADEMIC_CREDENTIALS</h3>
          </div>

          <div className="space-y-3">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="p-4 sm:p-5 rounded-lg glass-subcard-nested hover:border-accent/40 transition-all duration-150 group"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Column: Rows of Institute, Degree, Field/Group, Timeline & Result */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Row 1: Institute (highlighted) */}
                    <h4 className="text-sm sm:text-base font-bold text-text-main font-mono group-hover:text-accent transition-colors leading-snug">
                      {edu.institution}
                    </h4>

                    {/* Row 2: Degree or Exam */}
                    <div className="text-xs sm:text-sm font-semibold text-text-muted">
                      {edu.degree}
                    </div>

                    {/* Row 3: Major / Group / Dept (rendered directly from database) */}
                    {edu.field && (
                      <div className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                        <span className="text-accent font-bold">&gt;</span>
                        <span>{edu.field}</span>
                      </div>
                    )}

                    {/* Row 4: Description / Highlights */}
                    {edu.description && (
                      <p className="text-xs text-text-muted leading-relaxed font-mono pt-0.5">
                        {edu.description}
                      </p>
                    )}

                    {/* Row 5: Timeline & Location + Result on corner with padding */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/40 text-[11px] font-mono text-text-muted">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                        </span>
                        {edu.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-text-muted" />
                            <span>{edu.location}</span>
                          </span>
                        )}
                      </div>

                      {edu.grade && (
                        <span className="px-3 py-1 rounded-md bg-surface border border-border text-accent font-mono text-xs font-semibold shadow-xs">
                          {edu.grade}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Institution Logo / Image */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-accent flex-shrink-0 group-hover:border-accent/40 transition-colors overflow-hidden shadow-xs">
                    {edu.logoUrl ? (
                      <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                    ) : (
                      <School className="w-6 h-6 text-accent" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
