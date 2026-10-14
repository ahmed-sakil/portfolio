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
      className="group flex flex-col justify-between rounded-lg bg-surface border border-border overflow-hidden hover:border-accent/40 cursor-pointer transition-all duration-300 w-full min-w-0 sm:min-w-[280px]"
    >
      <div>
        {/* Project Thumbnail with dark overlay that clears to 100% on hover */}
        <div className="relative aspect-video w-full overflow-hidden bg-background border-b border-border">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
              {project.title}
            </div>
          )}

          {/* Dark shadow layer: hover reveals 100% full vibrant image */}
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/0 transition-colors duration-300 pointer-events-none" />

          {/* Icon in top-left corner with increased size */}
          {project.icon ? (
            <div className="absolute top-3 left-3 w-9 h-9 rounded-md bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-accent shadow-md group-hover:border-accent/50 transition-colors">
              {renderResolvedIcon(project.icon, <FolderGit2 className="w-4.5 h-4.5 text-accent" />, "w-4.5 h-4.5 text-accent")}
            </div>
          ) : (
            <div className="absolute top-3 left-3 w-9 h-9 rounded-md bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-accent shadow-md">
              <FolderGit2 className="w-4.5 h-4.5 text-accent" />
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          {/* Metadata chips */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono flex-wrap">
            <span className="px-2 py-0.5 rounded bg-background border border-border text-accent font-semibold">
              {project.category || 'Web Application'}
            </span>
            {project.level && (
              <span className="px-2 py-0.5 rounded bg-background border border-border text-text-muted">
                {project.level}
              </span>
            )}
            {project.projectType && (
              <span className="px-2 py-0.5 rounded bg-background border border-border text-text-muted">
                {project.projectType}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-text-main group-hover:text-accent transition-colors font-mono">
            {project.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-sans">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Card Footer: Tags & Action links */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-text-muted group-hover:border-accent/20 transition-colors"
            >
              #{tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
          <span className="font-mono text-[11px] text-text-muted group-hover:text-accent transition-colors flex items-center gap-1">
            <span>// CASE_STUDY</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md bg-background border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="View GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md bg-background border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                title="Live Preview"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
