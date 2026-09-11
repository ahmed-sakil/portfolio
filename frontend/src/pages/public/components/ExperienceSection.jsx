const ExperienceSection = ({ experiences }) => {
  return (
    <section id="experience" className="w-[90%] max-w-7xl mx-auto mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Career <span style={{ color: 'var(--accent)' }}>Timeline</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Education background and professional industry experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Education Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🎓</span>
              <h3 className="text-2xl font-bold text-white">Education</h3>
            </div>

            <div className="space-y-6">
              {experiences?.filter((e) => e.type === 'EDUCATION').map((exp, i) => (
                <div key={exp.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-purple-400 shadow-md shadow-purple-500/50' : 'bg-gray-600'}`} />
                    <div className="w-px flex-1 bg-white/10 mt-2" />
                  </div>

                  <div className="pb-8 flex-1">
                    <span className="inline-block px-2.5 py-0.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-purple-300 mb-2">
                      {new Date(exp.start_date).getFullYear()} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).getFullYear() : ''}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition">
                      {exp.title}
                    </h4>
                    <p className="text-sm font-medium text-gray-400 mb-1">{exp.company}</p>
                    {exp.result && <p className="text-xs text-teal-400 font-semibold mb-2">GPA / Result: {exp.result}</p>}
                    {exp.description && (
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
                    <span className="inline-block px-2.5 py-0.5 text-xs font-mono rounded bg-white/5 border border-white/10 text-teal-300 mb-2">
                      {new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-teal-300 transition">
                      {exp.title}
                    </h4>
                    <p className="text-sm font-medium text-gray-400 mb-2">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
