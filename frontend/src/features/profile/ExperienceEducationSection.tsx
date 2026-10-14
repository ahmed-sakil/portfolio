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
    <section id="experience" className="space-y-8 pt-6">
      {/* Coder-vibe Section Header with barcode line */}
      <SectionHeader
        tag="// timeline"
        title="EXPERIENCE & ACADEMIA"
        subtitle="Chronological track record spanning commercial software engineering and formal computer science education."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Commercial Experience */}
        <div className="rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
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
                className="p-4 rounded-lg bg-background border border-border hover:border-accent/40 transition-all duration-150 space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Company Image / Logo or fallback monogram */}
                    <div className="w-10 h-10 rounded-md bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-accent flex-shrink-0 group-hover:border-accent/40 transition-colors overflow-hidden">
                      {exp.logoUrl ? (
                        <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main font-mono group-hover:text-accent transition-colors">{exp.role}</h4>
                      <div className="text-xs text-text-muted font-medium">{exp.company}</div>
                    </div>
                  </div>

                  {exp.current && (
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent text-background uppercase">
                      Current
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-xs text-text-muted leading-relaxed font-mono pt-1">
                    {exp.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40 text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    <span>{exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-text-muted" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Formal Education */}
        <div className="rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
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
                className="p-4 rounded-lg bg-background border border-border hover:border-accent/40 transition-all duration-150 space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Institution Image / Logo or fallback icon */}
                    <div className="w-10 h-10 rounded-md bg-surface border border-border flex items-center justify-center font-mono font-bold text-xs text-accent flex-shrink-0 group-hover:border-accent/40 transition-colors overflow-hidden">
                      {edu.logoUrl ? (
                        <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                      ) : (
                        <School className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main font-mono group-hover:text-accent transition-colors">{edu.degree}</h4>
                      <div className="text-xs text-text-muted font-medium">{edu.institution}</div>
                    </div>
                  </div>

                  {edu.grade && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-accent">
                      {edu.grade}
                    </span>
                  )}
                </div>

                {edu.field && (
                  <div className="text-xs font-mono text-text-muted">
                    <span className="text-accent">&gt;</span> Major: {edu.field}
                  </div>
                )}

                {edu.description && (
                  <p className="text-xs text-text-muted leading-relaxed font-mono pt-1">
                    {edu.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40 text-[10px] font-mono text-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent" />
                    <span>{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </span>
                  {edu.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-text-muted" />
                      <span>{edu.location}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
