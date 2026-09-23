import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';
import { sortItemsBySlot } from '../../../utils/sortHelper';

const ProjectsSection = ({ projects = [] }) => {
  // Sort with slots first (Slot 1, 2, 3...) and unslotted at the end
  const sortedProjects = useMemo(() => sortItemsBySlot(projects), [projects]);

  if (!sortedProjects || sortedProjects.length === 0) return null;

  return (
    <section id="projects" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header - Left-Aligned & Developer Typography */}
        <div className="mb-8 sm:mb-12 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Featured <span style={{ color: 'var(--accent)' }}>Projects</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>
            // Real-world systems, full stack products, and open source creations
          </p>
        </div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="inner-glass rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
              style={{
                borderColor: 'var(--border-subtle)'
              }}
            >
              {/* Screenshot with padding and rounded border radius */}
              <div className="p-3 sm:p-4 pb-0">
                <Link
                  to={`/project/${project.id}`}
                  className="block relative overflow-hidden rounded-xl aspect-video border group/img"
                  style={{
                    background: 'var(--bg-surface-hover)',
                    borderColor: 'var(--border-subtle)',
                  }}
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
                </Link>
              </div>

              {/* Body: Type, Title, Short Description */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                    {project.type || 'Web Application'}
                  </div>

                  <Link to={`/project/${project.id}`}>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center justify-between gap-2 mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
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
                        className="p-1.5 rounded-lg hover:text-accent transition"
                        style={{ color: 'var(--text-secondary)' }}
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
                        className="p-1.5 rounded-lg hover:text-accent transition"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Short View All Button linking to dedicated /projects page */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-black cursor-pointer"
            style={{
              boxShadow: 'var(--accent-glow)'
            }}
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
