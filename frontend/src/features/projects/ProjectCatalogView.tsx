import React, { useState, useMemo } from 'react';
import { ProjectCard, Project } from './ProjectCard';
import { Search, ArrowLeft, Layers, X, Filter, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectCatalogViewProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const ProjectCatalogView: React.FC<ProjectCatalogViewProps> = ({
  projects,
  onClose,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Dynamic filter sets extracted from current projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const allTags = useMemo(() => {
    return Array.from(new Set(projects.flatMap((p) => p.tags || [])));
  }, [projects]);

  const isFiltering =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedLevel !== 'all' ||
    selectedType !== 'all' ||
    selectedTag !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedType('all');
    setSelectedTag('all');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && project.level !== selectedLevel) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && project.projectType !== selectedType) {
        return false;
      }

      // Tag filter
      if (selectedTag !== 'all' && !project.tags?.includes(selectedTag)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesSummary = project.summary?.toLowerCase().includes(query);
        const matchesCategory = project.category?.toLowerCase().includes(query);
        const matchesLevel = project.level?.toLowerCase().includes(query);
        const matchesType = project.projectType?.toLowerCase().includes(query);
        const matchesTags = project.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesAuthors = project.authors?.some((a) => a.name.toLowerCase().includes(query));

        if (
          !matchesTitle &&
          !matchesSummary &&
          !matchesCategory &&
          !matchesLevel &&
          !matchesType &&
          !matchesTags &&
          !matchesAuthors
        ) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedCategory, selectedLevel, selectedType, selectedTag, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="p-5 rounded-lg bg-surface border border-border space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Overview</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Layers className="w-3.5 h-3.5 text-accent" />
            <span>{filteredProjects.length} of {projects.length} Works</span>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-main">// ALL_REPOSITORIES_CATALOG</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Filter by domain, proficiency level, project type, or specific architectural keywords.
          </p>
        </div>

        {/* Search Bar with quick clear */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keywords, framework, tech stack, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent/60 transition-colors font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Multi-Criteria Filters */}
        <div className="space-y-2 pt-1 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] uppercase text-text-muted">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs text-text-main focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface text-text-main">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-surface text-text-main">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] uppercase text-text-muted">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent text-xs text-text-main focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface text-text-main">All Levels</option>
                <option value="Beginner" className="bg-surface text-text-main">Beginner</option>
                <option value="Intermediate" className="bg-surface text-text-main">Intermediate</option>
                <option value="Expert" className="bg-surface text-text-main">Expert</option>
              </select>
            </div>

            {/* Type Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] uppercase text-text-muted">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-xs text-text-main focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-surface text-text-main">All Types</option>
                <option value="Personal Project" className="bg-surface text-text-main">Personal Project</option>
                <option value="Group Project" className="bg-surface text-text-main">Group Project</option>
              </select>
            </div>

            {/* Reset Filters Action */}
            {isFiltering && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors ml-auto"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Quick Tag Pills (if any tags available) */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-thin">
              <span className="text-[10px] uppercase text-text-muted flex-shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-accent" />
                Stack:
              </span>
              <button
                onClick={() => setSelectedTag('all')}
                className={cn(
                  "px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0",
                  selectedTag === 'all'
                    ? "bg-accent text-background font-bold"
                    : "bg-background border border-border text-text-muted hover:text-text-main"
                )}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-mono transition-colors flex-shrink-0",
                    selectedTag === tag
                      ? "bg-accent text-background font-bold"
                      : "bg-background border border-border text-text-muted hover:text-text-main"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-lg bg-surface border border-border space-y-3 font-mono">
          <p className="text-xs text-text-muted">
            No deployments found matching the active search or filter criteria.
          </p>
          {isFiltering && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main hover:border-accent transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-accent" />
              <span>Clear Search & Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onSelectProject(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
