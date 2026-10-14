import React from 'react';
import { User, Briefcase, Globe, FileText, ExternalLink, Zap, ShieldCheck, Terminal } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';

interface AboutSectionProps {
  profile?: {
    name: string;
    title: string;
    bio: string;
    nationality?: string | null;
    experienceYears?: string | null;
    languages?: string | null;
    resumeUrl?: string | null;
    availableForWork?: boolean | null;
  } | null;
  socials?: Array<{
    id: string;
    title: string;
    icon: string;
    link: string;
  }>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const isAvailable = profile?.availableForWork !== false;

  return (
    <section id="about" className="space-y-6 pt-4">
      {/* Section Header */}
      <SectionHeader
        tag="// about"
        title="ENGINEERING PROFILE"
        subtitle="Architecting distributed backends, scalable systems, and high-performance interactive interfaces."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bio Terminal Card (5 cols) */}
        <div className="lg:col-span-5 rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent flex-shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text-main font-mono">// BIOGRAPHY_TERMINAL</h3>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border text-xs sm:text-sm text-text-muted leading-relaxed font-mono space-y-2">
              <p>
                <span className="text-accent font-bold">&gt; </span>
                {profile?.bio || 'Full stack engineer specialized in robust architectures, microservices, and interactive applications.'}
              </p>
            </div>
          </div>

          {/* Quick Technical Summary Pill */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-background border border-border font-mono text-xs">
              <span className="text-text-muted text-[11px] uppercase">Specialization</span>
              <span className="text-text-main font-semibold">Distributed Systems & Web</span>
            </div>
          </div>
        </div>

        {/* Right Column: Core Attributes Grid Card (7 cols) */}
        <div className="lg:col-span-7 rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main font-mono">// CORE_ATTRIBUTES</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono">
            {/* 1. Name */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors group">
              <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent group-hover:border-accent/50 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted uppercase">Full Name</div>
                <div className="text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                  {profile?.name || 'Md. Sakil Ahmed'}
                </div>
              </div>
            </div>

            {/* 2. Industry Experience */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors group">
              <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent group-hover:border-accent/50 transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted uppercase">Track Record</div>
                <div className="text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                  {profile?.experienceYears || '5+ Years Commercial'}
                </div>
              </div>
            </div>

            {/* 3. Spoken Languages */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors group">
              <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent group-hover:border-accent/50 transition-colors">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted uppercase">Languages</div>
                <div className="text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                  {profile?.languages || 'English, Bengali'}
                </div>
              </div>
            </div>

            {/* 4. Nationality */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors group">
              <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-sm group-hover:border-accent/50 transition-colors">
                🇧🇩
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted uppercase">Nationality</div>
                <div className="text-xs font-bold text-text-main truncate group-hover:text-accent transition-colors">
                  {profile?.nationality || 'Bangladeshi'}
                </div>
              </div>
            </div>

            {/* 5. Availability Status */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border hover:border-accent/40 transition-colors group">
              <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent group-hover:border-accent/50 transition-colors">
                <Zap className={isAvailable ? "w-4 h-4 text-emerald-400" : "w-4 h-4 text-text-muted"} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-text-muted uppercase">Contract Status</div>
                <div className={`text-xs font-bold flex items-center gap-1.5 truncate ${isAvailable ? 'text-emerald-400' : 'text-text-muted'}`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                  <span>{isAvailable ? 'Available for Contracts' : 'Engaged'}</span>
                </div>
              </div>
            </div>

            {/* 6. Resume / CV Link */}
            {profile?.resumeUrl ? (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-lg bg-background border border-border hover:border-accent/50 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent group-hover:border-accent/50 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-text-muted uppercase">Curriculum Vitae</div>
                    <div className="text-xs font-bold text-text-main group-hover:text-accent transition-colors truncate">
                      View Verified CV
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors flex-shrink-0" />
              </a>
            ) : (
              <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-background border border-border">
                <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 text-accent">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-text-muted uppercase">Curriculum Vitae</div>
                  <div className="text-xs font-bold text-text-muted truncate">
                    Available on Request
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

