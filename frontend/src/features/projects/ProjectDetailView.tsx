import React from 'react';
import { ArrowLeft, ExternalLink, Github, Users, User, FolderGit2, Layers, Cpu, Award } from 'lucide-react';
import { Project } from './ProjectCard';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
  backLabel?: string;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onClose, backLabel }) => {
  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : (project.galleryUrls && project.galleryUrls.length > 0 ? project.galleryUrls : []);

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{backLabel || '← Back to Portfolio'}</span>
        </button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-border bg-background hover:bg-surface-hover text-text-main transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Codebase</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono border border-border bg-accent text-background font-bold hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch App</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Case Study Container */}
      <div className="p-6 sm:p-8 rounded-lg bg-surface border border-border space-y-8 font-mono">
        {/* 1. TOP METADATA: Category, Level, Type (Personal/Group) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-md bg-accent/10 border border-accent/30 text-accent font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {project.category || 'Full Stack Web App'}
          </span>
          <span className="px-3 py-1 rounded-md bg-background border border-border text-text-muted flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-accent" />
            {project.level || 'Intermediate'}
          </span>
          <span className="px-3 py-1 rounded-md bg-background border border-border text-text-muted flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-accent" />
            {project.projectType || 'Personal Project'}
          </span>
        </div>

        {/* 2. ICON AND TITLE IN BIG FONT */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-accent flex-shrink-0 shadow-sm">
            {renderResolvedIcon(project.icon, <FolderGit2 className="w-6 h-6 text-accent" />, "w-6 h-6 text-accent")}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* 3. THUMBNAIL (BANNER) */}
        {project.thumbnail && (
          <div className="rounded-lg overflow-hidden border border-border bg-background aspect-video max-h-[500px]">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 4. PROJECT OVERVIEW */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <span>// PROJECT_OVERVIEW</span>
          </h2>
          <div className="p-4 sm:p-5 rounded-lg bg-background border border-border text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line">
            {project.summary}
          </div>
        </div>

        {/* 5. PROJECT DETAILS AND CASE STUDY (Rendered HTML with rich styling) */}
        {(project.caseStudy || project.descriptionMarkdown) && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <span>// PROJECT_DETAILS_AND_CASE_STUDY</span>
            </h2>
            <div
              className="p-5 sm:p-6 rounded-lg bg-background border border-border text-xs sm:text-sm text-text-main leading-relaxed space-y-4 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:text-accent [&>h1]:font-mono [&>h2]:text-base [&>h2]:font-bold [&>h2]:text-text-main [&>h2]:font-mono [&>h3]:text-sm [&>h3]:font-bold [&>h3]:text-accent [&>p]:text-text-muted [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-text-muted [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:text-text-muted [&>li]:text-text-muted [&>code]:bg-surface [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-accent [&>code]:text-[12px] [&>pre]:bg-surface [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>pre]:overflow-x-auto [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-text-muted [&>a]:text-accent [&>a]:underline hover:[&>a]:opacity-80"
              dangerouslySetInnerHTML={{
                __html: project.caseStudy || (project.descriptionMarkdown ? `<p>${project.descriptionMarkdown}</p>` : ''),
              }}
            />
          </div>
        )}

        {/* 6. SCREENSHOTS */}
        {screenshots.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <span>// SYSTEM_SCREENSHOTS ({screenshots.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {screenshots.map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-border bg-background group relative"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm border border-border text-[10px] text-text-muted font-mono">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TECHNOLOGY STACK */}
        {project.tags && project.tags.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>// TECHNOLOGY_STACK</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2 p-4 rounded-lg bg-background border border-border">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-mono bg-surface border border-border text-text-main flex items-center gap-1.5 hover:border-accent/40 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 8. AUTHORS AND CONTRIBUTORS */}
        {project.authors && project.authors.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent" />
              <span>// AUTHORS_AND_CONTRIBUTORS</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-background border border-border gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-accent flex-shrink-0">
                      {renderResolvedIcon(author.icon, <User className="w-4 h-4 text-accent" />, "w-4 h-4 text-accent")}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-text-main block truncate">
                        {author.name}
                      </span>
                      {author.portfolioUrl && (
                        <a
                          href={author.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-text-muted hover:text-accent truncate block"
                        >
                          {author.portfolioUrl.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>

                  {author.portfolioUrl && (
                    <a
                      href={author.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded border border-border hover:border-accent/50 text-text-muted hover:text-accent transition-colors flex-shrink-0"
                      title={`Visit ${author.name}'s profile`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. BOTTOM NAVIGATION / ACTION BAR */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-main text-xs font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← View Other Projects</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-main text-xs font-mono transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Codebase</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-accent bg-accent text-background font-bold text-xs font-mono hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Launch App</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
