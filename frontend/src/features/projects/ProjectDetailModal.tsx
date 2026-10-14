import React from 'react';
import { X, ExternalLink, Github, Tag } from 'lucide-react';
import { Project } from './ProjectCard';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface border border-border shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-surface/90 backdrop-blur-md px-6 py-4 border-b border-border flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="text-accent text-xs font-mono font-bold">CASE STUDY</span>
            <span className="text-border">/</span>
            <span className="text-xs font-mono text-text-muted truncate max-w-[200px] sm:max-w-md">
              {project.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Main Screenshot */}
          {project.thumbnail && (
            <div className="rounded-xl overflow-hidden border border-border bg-background aspect-video">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-main">{project.title}</h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{project.summary}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-background hover:bg-surface-hover text-text-main transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-accent text-background hover:opacity-90 transition-opacity font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-background border border-border text-xs">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Tag className="w-3.5 h-3.5 text-accent" />
              <span>Tech Stack:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-surface border border-border text-text-main"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deep-dive Case Study Writeup */}
          {project.descriptionMarkdown && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                Overview & Architecture
              </h4>
              <div className="prose prose-invert text-xs sm:text-sm text-text-muted leading-relaxed whitespace-pre-line bg-surface p-4 rounded-xl border border-border">
                {project.descriptionMarkdown}
              </div>
            </div>
          )}

          {/* Gallery Screenshots */}
          {project.galleryUrls && project.galleryUrls.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
                Screenshots & Previews
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.galleryUrls.map((url, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-border bg-background">
                    <img src={url} alt={`Gallery screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
