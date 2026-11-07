import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { ArrowLeft, ExternalLink, Github, Users, User, FolderGit2, Layers, Award } from 'lucide-react';
import { Project } from './ProjectCard';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface ProjectDetailViewProps {
  project: Project;
  onClose: () => void;
  backLabel?: string;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onClose, backLabel }) => {
  // Universal Escape key listener to close detail view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const screenshots = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : (project.galleryUrls && project.galleryUrls.length > 0 ? project.galleryUrls : []);

  return (
    <div className="space-y-6 pb-28 lg:pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-5 rounded-xl bg-surface border border-border shadow-sm gap-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-lg border border-border text-xs sm:text-sm font-mono text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel || 'Back to Overview'}</span>
        </button>

        <div className="flex items-center gap-2.5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-mono border border-border bg-background hover:bg-surface-hover text-text-main transition-colors shadow-xs"
              title="View Source Code"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Codebase</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 min-w-[130px] sm:min-w-[150px] rounded-lg text-xs sm:text-sm font-mono border border-accent bg-accent text-background font-bold hover:opacity-90 transition-all shadow-sm"
              title="Launch Live Application"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch App</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Case Study Container */}
      <div className="p-6 sm:p-8 lg:p-10 rounded-xl bg-surface border border-border space-y-8 font-mono shadow-sm">
        {/* 1. TOP METADATA: Category, Level, Type (Personal/Group) */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
          <span className="px-3.5 py-1.5 rounded-md bg-accent/10 border border-accent/30 text-accent font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {project.category || 'Full Stack Web App'}
          </span>
          <span className="px-3.5 py-1.5 rounded-md bg-background border border-border text-text-muted flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            {project.level || 'Intermediate'}
          </span>
          <span className="px-3.5 py-1.5 rounded-md bg-background border border-border text-text-muted flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            {project.projectType || 'Personal Project'}
          </span>
        </div>

        {/* 2. ICON AND TITLE IN BIG FONT */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-background border border-border flex items-center justify-center text-accent flex-shrink-0 shadow-md p-0 overflow-hidden">
            {renderResolvedIcon(
              project.icon,
              <FolderGit2 className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />,
              "w-8 h-8 sm:w-10 sm:h-10 text-accent",
              "w-full h-full object-contain p-0"
            )}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* 3. THUMBNAIL (BANNER) - Centered and enlarged */}
        {project.thumbnail && (
          <div className="w-full flex justify-center py-2">
            <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-border bg-background shadow-lg aspect-video max-h-[650px] flex items-center justify-center">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover sm:object-contain bg-background/50"
              />
            </div>
          </div>
        )}

        {/* 4. PROJECT OVERVIEW - Flat text, no enclosing box */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent flex items-center">
            <span>// PROJECT_OVERVIEW</span>
          </h2>
          <div className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line">
            {project.summary}
          </div>
        </div>

        {/* 5. PROJECT DETAILS AND CASE STUDY - Flat, no enclosing box */}
        {(project.caseStudy || project.descriptionMarkdown) && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent flex items-center">
              <span>// PROJECT_DETAILS_AND_CASE_STUDY</span>
            </h2>
            <div
              className="text-sm sm:text-base text-text-main leading-relaxed space-y-4 
                [&>h1]:text-xl sm:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-accent [&>h1]:font-mono [&>h1]:mt-6 [&>h1]:mb-3 [&>h1]:pb-2 [&>h1]:border-b [&>h1]:border-border/50
                [&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-text-main [&>h2]:font-mono [&>h2]:mt-6 [&>h2]:mb-2.5
                [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-accent [&>h3]:font-mono [&>h3]:mt-4 [&>h3]:mb-2
                [&>h4]:text-sm sm:[&>h4]:text-base [&>h4]:font-bold [&>h4]:text-text-main [&>h4]:mt-3 [&>h4]:mb-1.5
                [&>p]:text-text-muted [&>p]:leading-relaxed [&>p]:mb-3
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:text-text-muted [&>ul]:my-3
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:text-text-muted [&>ol]:my-3
                [&>li]:text-text-muted [&>li]:leading-relaxed
                [&>code]:bg-background [&>code]:px-2 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-accent [&>code]:text-xs [&>code]:font-mono [&>code]:border [&>code]:border-border/60
                [&>pre]:bg-background [&>pre]:p-4 sm:[&>pre]:p-5 [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-border [&>pre]:overflow-x-auto [&>pre]:my-4 [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:border-none [&>pre>code]:text-text-main
                [&>blockquote]:border-l-3 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:italic [&>blockquote]:text-text-muted [&>blockquote]:my-4 [&>blockquote]:bg-surface/50 [&>blockquote]:rounded-r-lg
                [&>table]:w-full [&>table]:my-4 [&>table]:border-collapse [&>table]:border [&>table]:border-border [&>table]:text-xs sm:[&>table]:text-sm
                [&>table_th]:border [&>table_th]:border-border [&>table_th]:p-2.5 [&>table_th]:bg-surface [&>table_th]:text-text-main [&>table_th]:text-left
                [&>table_td]:border [&>table_td]:border-border [&>table_td]:p-2.5 [&>table_td]:text-text-muted
                [&>a]:text-accent [&>a]:underline [&>a]:font-medium hover:[&>a]:opacity-80"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  project.caseStudy || (project.descriptionMarkdown ? `<p>${project.descriptionMarkdown}</p>` : ''),
                  {
                    ADD_ATTR: ['target', 'rel'],
                  }
                ),
              }}
            />
          </div>
        )}

        {/* 6. SCREENSHOTS */}
        {screenshots.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent flex items-center">
              <span>// SYSTEM_SCREENSHOTS ({screenshots.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {screenshots.map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden border border-border bg-background group relative shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border text-[11px] text-text-muted font-mono">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TECHNOLOGY STACK - Removed icon before title */}
        {project.tags && project.tags.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent flex items-center">
              <span>// TECHNOLOGY_STACK</span>
            </h2>
            <div className="flex flex-wrap items-center gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono bg-background border border-border text-text-main flex items-center gap-2 hover:border-accent/40 transition-colors shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 8. AUTHORS AND CONTRIBUTORS - Removed icon before title */}
        {project.authors && project.authors.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-accent flex items-center">
              <span>// AUTHORS_AND_CONTRIBUTORS</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {project.authors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-background border border-border gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-accent flex-shrink-0 p-0 overflow-hidden">
                      {renderResolvedIcon(author.icon, <User className="w-4 h-4 text-accent" />, "w-full h-full object-cover sm:object-contain text-accent")}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-text-main block truncate">
                        {author.name}
                      </span>
                      {author.portfolioUrl && (
                        <a
                          href={author.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-text-muted hover:text-accent truncate block"
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
                      className="p-2 rounded-lg border border-border hover:border-accent/50 text-text-muted hover:text-accent transition-colors flex-shrink-0"
                      title={`Visit ${author.name}'s profile`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. BOTTOM NAVIGATION / ACTION BAR */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-main text-xs sm:text-sm font-mono transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel || 'Back to Overview'}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-main text-xs sm:text-sm font-mono transition-colors shadow-sm"
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
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-accent bg-accent text-background font-bold text-xs sm:text-sm font-mono hover:opacity-90 transition-opacity shadow-sm"
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
