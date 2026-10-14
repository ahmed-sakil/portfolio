import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './lib/api';
import { Shell } from './components/layout/Shell';
import { AboutSection } from './features/profile/AboutSection';
import { ExperienceEducationSection } from './features/profile/ExperienceEducationSection';
import { SkillsSection } from './features/profile/SkillsSection';
import { ProjectsSection } from './features/projects/ProjectsSection';
import { ProjectCatalogView } from './features/projects/ProjectCatalogView';
import { ProjectDetailView } from './features/projects/ProjectDetailView';
import { ContactSection } from './features/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { Project } from './features/projects/ProjectCard';
import { useVisitorTracker } from './lib/useVisitorTracker';
import { DeveloperBootScreen } from './components/ui/DeveloperBootScreen';
import { HeroSection } from './features/hero/HeroSection';
import { useDynamicHead } from './lib/useDynamicHead';

interface ProfileData {
  profile: {
    name: string;
    title: string;
    bio: string;
    avatarUrl?: string | null;
    faviconUrl?: string | null;
    nationality?: string | null;
    experienceYears?: string | null;
    languages?: string | null;
    resumeUrl?: string | null;
    fontFamily?: string | null;
    availableForWork?: boolean | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
  } | null;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    icon?: string | null;
    order: number;
  }>;
  experiences: Array<{
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
  }>;
  educations?: Array<{
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
  }>;
  services?: Array<{
    id: string;
    title: string;
    icon?: string | null;
    order: number;
  }>;
}

export const PortfolioHome: React.FC = () => {
  // Activate automatic visitor telemetry tracker
  useVisitorTracker();

  // Developer boot/loading screen state (shows on every refresh)
  const [bootCompleted, setBootCompleted] = useState<boolean>(false);

  const [activeSection, setActiveSection] = useState('about');

  // Stacked sliding view states
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [openedFromCatalog, setOpenedFromCatalog] = useState(false);

  // Fetch Profile & Skills & Experience & Education
  const { data: profileData } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: () => apiClient<ProfileData>('/profile'),
  });

  // Reactive page title & dynamic favicon updater
  const developerName = profileData?.profile?.name || 'Md. Sakil Ahmed';
  const developerTitle = profileData?.profile?.title || 'Software Engineer & Architect';
  const faviconUrl = profileData?.profile?.faviconUrl;

  const currentTitle = isProjectDetailOpen && activeProject
    ? `${activeProject.title} — Case Study | ${developerName}`
    : isCatalogOpen
    ? `All Projects & Deployments | ${developerName}`
    : `${developerName} | ${developerTitle}`;

  useDynamicHead({
    title: currentTitle,
    faviconUrl,
  });

  // Dynamically set CSS variable --font-portfolio based on admin preference
  useEffect(() => {
    if (profileData?.profile?.fontFamily) {
      const selected = profileData.profile.fontFamily;
      const fontMapping: Record<string, string> = {
        'JetBrains Mono': "'JetBrains Mono', monospace",
        'Fira Code': "'Fira Code', monospace",
        'Geist Mono': "'Geist Mono', monospace",
        'Space Mono': "'Space Mono', monospace",
        'Inter Sans': "'Inter', sans-serif",
      };
      const family = fontMapping[selected] || "'JetBrains Mono', monospace";
      document.documentElement.style.setProperty('--font-portfolio', family);
    }
  }, [profileData]);

  // Fetch Hero Socials
  const { data: heroSocials = [] } = useQuery<any[]>({
    queryKey: ['socials', 'hero'],
    queryFn: () => apiClient<any[]>('/socials?position=hero'),
  });

  // Fetch All Socials (For Contact dispatch and drawer)
  const { data: allSocials = [] } = useQuery<any[]>({
    queryKey: ['socials', 'all'],
    queryFn: () => apiClient<any[]>('/socials'),
  });

  // Fetch Projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => apiClient<Project[]>('/projects'),
  });

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsCatalogOpen(false);
    setIsProjectDetailOpen(false);
    requestAnimationFrame(() => {
      const lenis = (window as any).__portfolioLenis;
      const el = document.getElementById(sectionId);
      if (lenis && el) {
        lenis.scrollTo(el, { duration: 1.2, offset: -20 });
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const handleOpenCatalog = () => {
    setIsCatalogOpen(true);
  };

  const handleOpenProjectFromOverview = (project: Project) => {
    setActiveProject(project);
    setOpenedFromCatalog(false);
    setIsProjectDetailOpen(true);
  };

  const handleOpenProjectFromCatalog = (project: Project) => {
    setActiveProject(project);
    setOpenedFromCatalog(true);
    setIsProjectDetailOpen(true);
  };

  const handleCloseCatalog = () => {
    setIsCatalogOpen(false);
  };

  const handleCloseProjectDetail = () => {
    setIsProjectDetailOpen(false);
  };

  const handleBootComplete = () => {
    setBootCompleted(true);
  };

  return (
    <>
      {/* 4-5s Developer Barcode Boot / Loading Sequence */}
      {!bootCompleted && (
        <DeveloperBootScreen
          onBootComplete={handleBootComplete}
          developerName={profileData?.profile?.name || 'SAKIL AHMED'}
        />
      )}

      <Shell
        profile={profileData?.profile}
        socials={allSocials}
        heroSocials={heroSocials}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isCatalogOpen={isCatalogOpen}
        catalogView={
          <ProjectCatalogView
            projects={projects}
            onClose={handleCloseCatalog}
            onSelectProject={handleOpenProjectFromCatalog}
          />
        }
        isProjectDetailOpen={isProjectDetailOpen}
        projectDetailView={
          activeProject ? (
            <ProjectDetailView
              project={activeProject}
              onClose={handleCloseProjectDetail}
              backLabel={openedFromCatalog ? "← Back to All Projects" : "← Back to Overview"}
            />
          ) : null
        }
      >
        {/* Main Overview Canvas (Always preserved in DOM for zero jumpscare & perfect scroll retention) */}
        <div className="space-y-12">
          <HeroSection profile={profileData?.profile} />

          <AboutSection
            profile={profileData?.profile}
            socials={heroSocials}
          />

          <ExperienceEducationSection
            experiences={profileData?.experiences || []}
            educations={profileData?.educations || []}
          />

          <SkillsSection skills={profileData?.skills || []} />

          <ProjectsSection
            projects={projects}
            onOpenProject={handleOpenProjectFromOverview}
            onOpenCatalog={handleOpenCatalog}
          />

          <ContactSection
            socials={allSocials}
            services={profileData?.services || []}
            availableForWork={profileData?.profile?.availableForWork !== false}
          />

          <Footer profile={profileData?.profile} />
        </div>
      </Shell>
    </>
  );
};
