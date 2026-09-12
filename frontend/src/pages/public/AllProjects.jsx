import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowLeft, ExternalLink, Search, ArrowRight, Users, User } from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import AppIcon from '../../components/icons/AppIcon';
import SmoothScroll from '../../components/SmoothScroll';
import { sortItemsBySlot } from '../../utils/sortHelper';
import { updatePageMeta } from '../../utils/pageMeta';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Ensure sorted by slot with unslotted items placed at the end
  const sortedProjects = useMemo(() => sortItemsBySlot(projects), [projects]);

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return sortedProjects;
    const q = searchQuery.toLowerCase();
    return sortedProjects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tech_stack?.some((t) => t.toLowerCase().includes(q))
    );
  }, [sortedProjects, searchQuery]);

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10">
            <div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
                All <span style={{ color: 'var(--accent)' }}>Projects</span>
              </h1>
              <p className="text-xs sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                Complete archive of web applications, systems, full-stack projects, and open-source contributions.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-base sm:text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-teal-400/20 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
              <span className="text-sm text-teal-400 font-medium">Loading all projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 text-center text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              No projects found matching "{searchQuery}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 pt-6 sm:pt-8">
              {filteredProjects.map((project) => {
                const isTeam = project.project_type === 'TEAM';
                const techStack = Array.isArray(project.tech_stack)
                  ? project.tech_stack
                  : (typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack || '[]') : []);

                return (
                  <div
                    key={project.id}
                    className="inner-glass rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(0,229,160,0.15)] transition-all duration-300"
                  >
                    <Link to={`/project/${project.id}`} className="block relative overflow-hidden aspect-video group/img">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900/60 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                          No Preview Available
                        </div>
                      )}

                      {/* Level & Type Badges over image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-gray-200">
                          {project.level || 'Intermediate'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-gray-200">
                          {isTeam ? (
                            <>
                              <Users className="w-3 h-3 text-teal-400" /> Team
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 text-gray-400" /> Personal
                            </>
                          )}
                        </span>
                      </div>
                    </Link>

                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/project/${project.id}`}>
                          <h2 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition line-clamp-1">
                            {project.title}
                          </h2>
                        </Link>
                        <p className="text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                          {project.description}
                        </p>

                        {/* Tech stack pills with AppIcon */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {techStack.map((tech, i) => {
                            const meta = getSkillMeta(tech);
                            return (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/5 text-gray-300"
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
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                        <Link
                          to={`/project/${project.id}`}
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 transition"
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
                              className="p-1.5 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-white/5 transition"
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
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
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
    </div>
  );
};

export default AllProjects;
