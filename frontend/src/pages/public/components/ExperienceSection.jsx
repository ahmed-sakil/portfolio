import { ExternalLink } from 'lucide-react';

const ExperienceSection = ({ experiences }) => {
  return (
    <section id="experience" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3" style={{ color: 'var(--text-primary)' }}>
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
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Education
              </h3>
            </div>

            <div className="space-y-6">
              {experiences?.filter((e) => e.type === 'EDUCATION').map((exp, i) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 transition-all"
                      style={{
                        backgroundColor: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                        boxShadow: i === 0 ? 'var(--accent-glow)' : 'none'
                      }}
                    />
                    <div className="w-px flex-1 mt-2" style={{ background: 'var(--border-subtle)' }} />
                  </div>

                  <div className="pb-8 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span
                        className="inline-block px-2.5 py-0.5 text-xs font-mono rounded border"
                        style={{
                          background: 'var(--bg-surface-hover)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--accent)'
                        }}
                      >
                        {new Date(exp.start_date).getFullYear()} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-lg font-bold mb-1 transition group-hover:text-accent"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {exp.title}
                        </h4>

                        <div className="mb-1.5">
                          {exp.institution_url ? (
                            <a
                              href={exp.institution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold transition inline-flex items-center gap-1.5 underline-offset-4 hover:underline hover:text-accent"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3 opacity-80" style={{ color: 'var(--accent)' }} />
                            </a>
                          ) : (
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{exp.company}</p>
                          )}
                        </div>

                        {exp.result && (
                          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                            {exp.result}
                          </p>
                        )}
                      </div>

                      {exp.image_url && (
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-2 shrink-0 border transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                          style={{
                            background: 'var(--bg-surface-hover)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
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
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Experience
              </h3>
            </div>

            <div className="space-y-6">
              {experiences?.filter((e) => e.type === 'EXPERIENCE').map((exp, i) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 transition-all"
                      style={{
                        backgroundColor: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                        boxShadow: i === 0 ? 'var(--accent-glow)' : 'none'
                      }}
                    />
                    <div className="w-px flex-1 mt-2" style={{ background: 'var(--border-subtle)' }} />
                  </div>

                  <div className="pb-8 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span
                        className="inline-block px-2.5 py-0.5 text-xs font-mono rounded border"
                        style={{
                          background: 'var(--bg-surface-hover)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--accent)'
                        }}
                      >
                        {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-lg font-bold mb-1 transition group-hover:text-accent"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {exp.title}
                        </h4>

                        <div className="mb-1.5">
                          {exp.institution_url ? (
                            <a
                              href={exp.institution_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold transition inline-flex items-center gap-1.5 underline-offset-4 hover:underline hover:text-accent"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3 opacity-80" style={{ color: 'var(--accent)' }} />
                            </a>
                          ) : (
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{exp.company}</p>
                          )}
                        </div>

                        {exp.result && (
                          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                            {exp.result}
                          </p>
                        )}
                      </div>

                      {exp.image_url && (
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-2 shrink-0 border transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                          style={{
                            background: 'var(--bg-surface-hover)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
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
