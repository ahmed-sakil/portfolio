import React from 'react';
import { ProjectCard, Project } from './ProjectCard';
import { Layers, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../../components/ui/SectionHeader';

interface ProjectsSectionProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onOpenCatalog: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects = [],
  onOpenProject,
  onOpenCatalog,
}) => {
  const featuredProjects = projects.filter((p) => p.isFeatured);

  return (
    <section id="projects" className="space-y-6 p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl glass-panel">
      {/* Section Header */}
      <SectionHeader
        tag="//"
        title="FEATURED PROJECTS"
        subtitle="Selected applications, web platforms, and open-source systems I have developed."
      />

      {/* Featured Projects Grid (Max 2 per row for expanded width) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onOpenProject(project)}
          />
        ))}
      </div>

      {/* Action Button at bottom */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg border border-border text-xs font-mono text-text-main hover:border-accent/60 bg-surface hover:bg-surface-hover transition-all shadow-sm hover:shadow group"
        >
          <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center text-accent group-hover:border-accent/40">
            <Layers className="w-3 h-3" />
          </div>
          <span>EXPLORE_ALL_PROJECTS ({projects.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>
    </section>
  );
};
