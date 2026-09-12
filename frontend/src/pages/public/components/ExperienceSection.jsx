import { ExternalLink } from 'lucide-react';

const ExperienceSection = ({ experiences }) => {
  return (
    <section id="experience" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2 sm:mb-3">
            Career <span style={{ color: 'var(--accent)' }}>Timeline</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Education background and professional industry experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Education Column */}
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl">🎓</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Education</h3>
            </div>

            <div className="space-y-6">
              {experiences?.filter((e) => e.type === 'EDUCATION').map((exp, i) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-purple-400 shadow-md shadow-purple-500/50' : 'bg-gray-600'}`} />
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  </div>

                  <div className="pb-8 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-purple-300">
                        {new Date(exp.start_date).getFullYear()} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition">
                          {exp.title}
                        </h4>

                        <div className="mb-1.5">
                          {exp.institution_url ? (
                            <a
                              href={exp.institution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3 text-purple-400 opacity-80" />
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-gray-400">{exp.company}</p>
                          )}
                        </div>

                        {exp.result && (
                          <p className="text-xs text-teal-400 font-semibold mb-2">
                            {exp.result}
                          </p>
                        )}
                      </div>

                      {exp.image_url && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2 shrink-0 group-hover:border-purple-400/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                          <img
                            src={exp.image_url}
                            alt={exp.company}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">💼</span>
              <h3 className="text-2xl font-bold text-white">Experience</h3>
            </div>

            <div className="space-y-6">
              {experiences?.filter((e) => e.type === 'EXPERIENCE').map((exp, i) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-teal-400 shadow-md shadow-teal-500/50' : 'bg-gray-600'}`} />
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  </div>

                  <div className="pb-8 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-teal-300">
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition">
                          {exp.title}
                        </h4>

                        <div className="mb-1.5">
                          {exp.institution_url ? (
                            <a
                              href={exp.institution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-gray-300 hover:text-teal-300 transition inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3 text-teal-400 opacity-80" />
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-gray-400">{exp.company}</p>
                          )}
                        </div>

                        {exp.result && (
                          <p className="text-xs text-teal-400 font-semibold mb-2">
                            {exp.result}
                          </p>
                        )}
                      </div>

                      {exp.image_url && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-2 shrink-0 group-hover:border-teal-400/50 group-hover:shadow-[0_0_20px_rgba(0,229,160,0.25)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                          <img
                            src={exp.image_url}
                            alt={exp.company}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--text-secondary)' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
