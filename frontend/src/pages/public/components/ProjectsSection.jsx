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
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-white/10 overflow-hidden flex flex-col group hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(0,229,160,0.2)] transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.03)' }}
            >
              {project.image_url ? (
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-white/5 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                  No Preview Available
                </div>
              )}

              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {project.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-semibold rounded-md border border-teal-400/30 bg-teal-400/10 text-teal-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  {project.live_link && (
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-white transition"
                    >
                      <GithubIcon className="w-4 h-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
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
