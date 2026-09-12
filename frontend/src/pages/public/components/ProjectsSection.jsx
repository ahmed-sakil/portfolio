import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Layers, Users, User } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';
import AppIcon from '../../../components/icons/AppIcon';
import { sortItemsBySlot } from '../../../utils/sortHelper';

const ProjectsSection = ({ projects = [], skills = [] }) => {
  // Sort with slots first (Slot 1, 2, 3...) and unslotted at the end
  const sortedProjects = useMemo(() => sortItemsBySlot(projects), [projects]);

  const getSkillMeta = (techName) => {
    if (!techName) return null;
    const norm = techName.trim().toLowerCase();
    return skills.find((s) => s.name.toLowerCase() === norm);
  };

  if (!sortedProjects || sortedProjects.length === 0) return null;

  return (
    <section id="projects" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
            Featured <span style={{ color: 'var(--accent)' }}>Projects</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Real-world systems, full stack products, and open source creations.
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {sortedProjects.map((project) => {
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
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition line-clamp-1">
                        {project.title}
                      </h3>
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

        {/* Short View All Button linking to dedicated /projects page */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 border border-teal-400/40 bg-teal-400/10 text-teal-300 hover:bg-teal-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,229,160,0.4)]"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
