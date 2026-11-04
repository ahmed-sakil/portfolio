import React from 'react';
import { ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { renderResolvedIcon } from '../../lib/iconResolver';

export interface Author {
  id: string;
  name: string;
  icon?: string | null;
  portfolioUrl?: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category?: string;
  icon?: string | null;
  summary: string;
  caseStudy?: string | null;
  descriptionMarkdown?: string | null;
  thumbnail?: string | null;
  screenshots?: string[];
  galleryUrls?: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  tags: string[];
  level?: string;
  projectType?: string;
  isFeatured: boolean;
  featuredPriority?: number;
  order: number;
  authors?: Author[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onHover?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onHover }) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex flex-col justify-between rounded-lg glass-subcard overflow-hidden hover:border-accent/40 focus:border-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 cursor-pointer transition-all duration-300 w-full min-w-0"
    >
      <div>
        {/* Project Thumbnail with dark overlay that clears on hover, focus, and active tap */}
        <div className="relative aspect-video w-full overflow-hidden bg-background border-b border-border">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
              {project.title}
            </div>
          )}

          {/* Dark shadow layer: hover, keyboard focus, and mobile tap/focus reveals 100% vibrant image */}
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/0 group-focus:bg-black/0 group-focus-within:bg-black/0 group-active:bg-black/0 transition-colors duration-300 pointer-events-none" />

          {/* Enlarge icon on top-left corner */}
          {project.icon ? (
            <div className="absolute top-3 left-3 w-11 h-11 rounded-lg bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-accent shadow-md group-hover:border-accent/60 transition-colors p-0 overflow-hidden">
              {renderResolvedIcon(project.icon, <FolderGit2 className="w-6 h-6 text-accent" />, "w-full h-full object-cover sm:object-contain text-accent")}
            </div>
          ) : (
            <div className="absolute top-3 left-3 w-11 h-11 rounded-lg bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-accent shadow-md">
              <FolderGit2 className="w-6 h-6 text-accent" />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-text-main group-hover:text-accent transition-colors font-mono">
            {project.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-sans">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Card Footer: Tech stack cards with generous padding & action links */}
      <div className="p-4 pt-1 space-y-3.5">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-background border border-border/40 text-text-muted group-hover:border-accent/30 group-hover:text-text-main transition-colors shadow-2xs"
            >
              #{tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-2 py-1 text-[11px] font-mono text-text-muted bg-background/50 rounded-md border border-border/40">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
          {/* UX Friendly Case Study Action Button */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono font-medium text-text-main group-hover:border-accent/60 group-hover:bg-accent group-hover:text-background transition-all shadow-xs">
            <span>Case Study</span>
            <span className="group-hover:translate-x-0.5 transition-transform font-bold">→</span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="View Codebase"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
