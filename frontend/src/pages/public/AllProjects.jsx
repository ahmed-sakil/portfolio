import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  ArrowRight, 
  Users, 
  User, 
  SlidersHorizontal, 
  X, 
  Check,
  RotateCcw
} from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import AppIcon from '../../components/icons/AppIcon';
import SmoothScroll from '../../components/SmoothScroll';
import { sortItemsBySlot } from '../../utils/sortHelper';
import { updatePageMeta } from '../../utils/pageMeta';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORY_OPTIONS = ['All', 'Personal', 'Group'];

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Advanced Filter Modal & Options
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [techSearch, setTechSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    updatePageMeta({ title: 'Projects Archive | Sakil Ahmed' });

    const fetchData = async () => {
      try {
        const [projRes, portRes] = await Promise.all([
          api.get('/projects'),
          api.get('/portfolio').catch(() => ({ data: { skills: [] } }))
        ]);
        setProjects(projRes.data || []);
        setSkills(portRes.data?.skills || []);
      } catch (err) {
        console.error('Error fetching all projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSkillMeta = (techName) => {
    if (!techName) return null;
    const norm = techName.trim().toLowerCase();
    return skills.find((s) => s.name.toLowerCase() === norm);
  };

  // Collect all unique types and tech stacks across projects
  const availableTypes = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.type?.trim()) set.add(p.type.trim());
    });
    return Array.from(set);
  }, [projects]);

  const availableTechs = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const stack = Array.isArray(p.tech_stack)
        ? p.tech_stack
        : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack || '[]') : []);
      stack.forEach((t) => { if (t) set.add(t); });
    });
    skills.forEach((s) => { if (s.name) set.add(s.name); });
    return Array.from(set).sort();
  }, [projects, skills]);

  const filteredAvailableTechs = useMemo(() => {
    if (!techSearch.trim()) return availableTechs;
    const q = techSearch.toLowerCase();
    return availableTechs.filter((t) => t.toLowerCase().includes(q));
  }, [availableTechs, techSearch]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedTypes.length > 0) count += selectedTypes.length;
    if (selectedCategory !== 'All') count += 1;
    if (selectedLevels.length > 0) count += selectedLevels.length;
    if (selectedTechs.length > 0) count += selectedTechs.length;
    return count;
  }, [selectedTypes, selectedCategory, selectedLevels, selectedTechs]);

  const handleClearFilters = () => {
    setSelectedTypes([]);
    setSelectedCategory('All');
    setSelectedLevels([]);
    setSelectedTechs([]);
    setTechSearch('');
  };

  const handleSearch = () => {
    setActiveSearch(searchInput.trim());
  };

  // Filter and sort projects
  const sortedProjects = useMemo(() => sortItemsBySlot(projects), [projects]);

  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((p) => {
      const pCategory = p.category || (p.project_type === 'TEAM' ? 'Group' : 'Personal');
      const pType = p.type || 'Web Application';
      const pLevel = p.level || 'Intermediate';
      const pStack = Array.isArray(p.tech_stack)
        ? p.tech_stack
        : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack || '[]') : []);

      // Search match
      if (activeSearch) {
        const q = activeSearch.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesType = pType.toLowerCase().includes(q);
        const matchesTech = pStack.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesType && !matchesTech) return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(pType)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && pCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(pLevel)) {
        return false;
      }

      // Tech stack filter (must contain at least one of selected techs if any selected)
      if (selectedTechs.length > 0) {
        const hasTech = selectedTechs.some((st) => 
          pStack.some((pt) => pt.toLowerCase() === st.toLowerCase())
        );
        if (!hasTech) return false;
      }

      return true;
    });
  }, [sortedProjects, activeSearch, selectedTypes, selectedCategory, selectedLevels, selectedTechs]);

  return (
    <div className="min-h-screen pb-24 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      <SmoothScroll />

      {/* Floating Header */}
      <header className="sticky top-3 sm:top-4 z-50 w-[94%] sm:w-[90%] max-w-7xl mx-auto mb-6 sm:mb-10">
        <nav className="glass-panel rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border border-white/10 shadow-xl">
          <Link
            to="/"
            className="inline-flex items-center text-xs sm:text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" /> Back to Portfolio
          </Link>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate ml-2" style={{ color: 'var(--text-muted)' }}>
            All Projects Archive
          </span>
        </nav>
      </header>

      {/* Main Container */}
      <main className="w-[94%] sm:w-[90%] max-w-7xl mx-auto">
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 mb-10">
          <div className="pb-6 sm:pb-8 border-b space-y-6" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
                All <span style={{ color: 'var(--accent)' }}>Projects</span>
              </h1>
              <p className="text-xs sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Complete archive of web applications, systems, full-stack projects, and open-source contributions.
              </p>
            </div>

            {/* Search Box & Advanced Filter Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-3xl">
              {/* Search input with search button */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search projects by title, description, or tech..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl text-base sm:text-sm border transition focus:outline-none focus:border-accent"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--text-inverted)'
                  }}
                >
                  Search
                </button>
              </div>

              {/* Advanced Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer"
                style={{
                  background: 'var(--bg-surface-hover)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <SlidersHorizontal className="w-4 h-4 text-accent" />
                <span>Advanced Filter</span>
                {activeFilterCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--text-inverted)'
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Counter Text: Showing {4} of {19} projects */}
            <div className="flex items-center justify-between pt-2 text-xs sm:text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
              <div>
                Showing <strong className="font-bold text-accent">{filteredProjects.length}</strong> of{' '}
                <strong className="font-bold" style={{ color: 'var(--text-primary)' }}>{projects.length}</strong> projects
                {activeSearch && (
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                    (matching "{activeSearch}")
                  </span>
                )}
              </div>

              {(activeFilterCount > 0 || activeSearch) && (
                <button
                  type="button"
                  onClick={() => {
                    handleClearFilters();
                    setSearchInput('');
                    setActiveSearch('');
                  }}
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset filters</span>
                </button>
              )}
            </div>
          </div>

          {/* Project List */}
          {loading ? (
            <div className="py-24 text-center">
              <div
                className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>Loading all projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 text-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              No projects found matching current criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 pt-6 sm:pt-8">
              {filteredProjects.map((project) => {
                const category = project.category || (project.project_type === 'TEAM' ? 'Group' : 'Personal');
                const techStack = Array.isArray(project.tech_stack)
                  ? project.tech_stack
                  : (typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack || '[]') : []);

                // Short description from description and ... in the end
                const rawDesc = project.description?.trim() || '';
                const shortDesc = rawDesc.length > 110 ? `${rawDesc.slice(0, 110)}...` : (rawDesc ? `${rawDesc}...` : 'No description available...');

                return (
                  <div
                    key={project.id}
                    className="inner-glass rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-accent hover:shadow-[0_0_25px_var(--accent-glow)] transition-all duration-300"
                    style={{ backgroundColor: 'var(--bg-surface)' }}
                  >
                    {/* Screenshot with padding and border radius */}
                    <div className="p-3 sm:p-4 pb-0">
                      <Link
                        to={`/project/${project.id}`}
                        className="block relative overflow-hidden rounded-xl aspect-video border border-white/10 group/img"
                        style={{ backgroundColor: 'var(--bg-base)' }}
                      >
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
                            No Preview Available
                          </div>
                        )}

                        {/* Projects icon on the screenshot in the right corner with a border */}
                        {project.icon_url && (
                          <div
                            className="absolute top-2.5 right-2.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-white/30 backdrop-blur-md shadow-lg p-0.5"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                          >
                            <img
                              src={project.icon_url}
                              alt="icon"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </Link>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Type and level in same line in short font, left and right */}
                        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase mb-2">
                          <span className="text-accent truncate mr-2">
                            {project.type || 'Web Application'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                            {project.level || 'Intermediate'}
                          </span>
                        </div>

                        {/* Below: Title */}
                        <Link to={`/project/${project.id}`}>
                          <h2
                            className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition line-clamp-1"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {project.title}
                          </h2>
                        </Link>

                        {/* Below: Short description from description and ... in the end */}
                        <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                          {shortDesc}
                        </p>

                        {/* Below: Category (Personal / Group) */}
                        <div className="mb-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-white/10"
                            style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}
                          >
                            {category === 'Group' ? (
                              <>
                                <Users className="w-3.5 h-3.5 text-accent" />
                                <span>Group Project</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3.5 h-3.5 opacity-70" />
                                <span>Personal Project</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Below: Tech stack */}
                        {techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {techStack.map((tech, i) => {
                              const meta = getSkillMeta(tech);
                              return (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/5"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  <AppIcon
                                    iconUrl={meta?.icon_url}
                                    iconName={meta?.icon_name || tech}
                                    iconType={meta?.icon_type || 'light'}
                                    className="w-3.5 h-3.5 shrink-0"
                                    alt={tech}
                                  />
                                  <span>{tech}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Below: Details, live or github button */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 mt-auto">
                        <Link
                          to={`/project/${project.id}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-accent hover:opacity-80 transition"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <div className="flex items-center gap-3">
                          {project.live_link && (
                            <a
                              href={project.live_link}
                              target="_blank"
                              rel="noreferrer"
                              title="Live Demo"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-white/5 transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.github_link && (
                            <a
                              href={project.github_link}
                              target="_blank"
                              rel="noreferrer"
                              title="Source Code"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-white/5 transition"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Advanced Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div
            className="glass-panel max-w-xl w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/15 shadow-2xl max-h-[90vh] flex flex-col"
            style={{ backgroundColor: 'var(--bg-surface)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Advanced Filter</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-6 py-4 flex-1 pr-1">
              {/* Category (Personal / Group) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        style={isSelected ? {
                          backgroundColor: 'var(--accent)',
                          color: 'var(--text-inverted)',
                          borderColor: 'var(--accent)'
                        } : {
                          color: 'var(--text-secondary)'
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          isSelected
                            ? 'shadow-[0_0_15px_var(--accent-glow)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {cat === 'All' ? 'All Categories' : `${cat} Project`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Level */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                  Project Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEVEL_OPTIONS.map((lvl) => {
                    const isSelected = selectedLevels.includes(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedLevels(selectedLevels.filter((l) => l !== lvl));
                          } else {
                            setSelectedLevels([...selectedLevels, lvl]);
                          }
                        }}
                        style={isSelected ? {
                          backgroundColor: 'var(--accent)',
                          color: 'var(--text-inverted)',
                          borderColor: 'var(--accent)'
                        } : {
                          color: 'var(--text-secondary)'
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'shadow-[0_0_15px_var(--accent-glow)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Type List */}
              {availableTypes.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
                    Project Type / Architecture
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTypes.map((typ) => {
                      const isSelected = selectedTypes.includes(typ);
                      return (
                        <button
                          key={typ}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTypes(selectedTypes.filter((t) => t !== typ));
                            } else {
                              setSelectedTypes([...selectedTypes, typ]);
                            }
                          }}
                          style={isSelected ? {
                            backgroundColor: 'var(--accent)',
                            color: 'var(--text-inverted)',
                            borderColor: 'var(--accent)'
                          } : {
                            color: 'var(--text-secondary)'
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'shadow-[0_0_15px_var(--accent-glow)]'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{typ}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tech Stack Multi-Select */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Tech Stack & Skills
                  </label>
                  {selectedTechs.length > 0 && (
                    <span className="text-xs font-mono text-accent">
                      {selectedTechs.length} selected
                    </span>
                  )}
                </div>

                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filter technologies (e.g. React, Docker, Python)..."
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-base)' }}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border border-white/10 placeholder-gray-500 focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div
                  className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto p-2 rounded-xl border border-white/5"
                  style={{ backgroundColor: 'var(--bg-base)' }}
                >
                  {filteredAvailableTechs.length === 0 ? (
                    <span className="text-xs italic p-1" style={{ color: 'var(--text-muted)' }}>No matching technology found</span>
                  ) : (
                    filteredAvailableTechs.map((tech) => {
                      const isSelected = selectedTechs.includes(tech);
                      const meta = getSkillMeta(tech);
                      return (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTechs(selectedTechs.filter((t) => t !== tech));
                            } else {
                              setSelectedTechs([...selectedTechs, tech]);
                            }
                          }}
                          style={isSelected ? {
                            backgroundColor: 'var(--accent)',
                            color: 'var(--text-inverted)',
                            borderColor: 'var(--accent)'
                          } : {
                            color: 'var(--text-secondary)'
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            isSelected
                              ? 'font-semibold'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <AppIcon
                            iconUrl={meta?.icon_url}
                            iconName={meta?.icon_name || tech}
                            iconType={meta?.icon_type || 'light'}
                            className="w-3.5 h-3.5 shrink-0"
                            alt={tech}
                          />
                          <span>{tech}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-accent hover:bg-white/5 transition cursor-pointer"
              >
                Clear All
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 transition cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverted)' }}
                  className="px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-[0_0_15px_var(--accent-glow)] cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
