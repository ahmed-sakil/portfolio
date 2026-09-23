import { Sparkles, Code2 } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';

const DEFAULT_JOURNEY_PARAGRAPHS = [
  "After SSC, moving to Dhaka and getting WiFi sparked my interest in programming. Out of curiosity and a desire to create, I started building small web pages using HTML. At first, it was simple experimentation, but I was fascinated by how people could build such beautiful websites and wanted to learn more.",
  "Gradually, I learned JavaScript, React, and modern backend architectures. Through continuous learning, practice, and experimentation, I became proficient in web development and am now able to create and implement complete full-stack applications and scalable solutions."
];

const JourneySection = ({ profile, projects = [] }) => {
  const yearsExp = profile?.years_of_experience ?? 1;
  const projectsCount = projects && projects.length > 0 ? projects.length : 19;

  const rawText = profile?.journey_text || profile?.bio;
  const paragraphs = rawText
    ? rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    : DEFAULT_JOURNEY_PARAGRAPHS;

  return (
    <section id="journey" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-20 sm:mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Section Header - Left-Aligned & Developer Typography */}
        <div className="mb-8 sm:mb-12 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            The <span style={{ color: 'var(--accent)' }}>Journey</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>
            // From initial curiosity to architecting scalable full-stack applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
          {/* Left Column: Narrative Card */}
          <div className="lg:col-span-6">
            <div
              className="inner-glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Paragraphs */}
              <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm md:text-base leading-relaxed font-normal relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Bottom Key Stats Row */}
              <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t flex items-center gap-8 sm:gap-16 relative z-10" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: 'var(--text-primary)' }}>
                    {yearsExp}+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 block" style={{ color: 'var(--accent)' }}>
                    YEARS EXP.
                  </span>
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-black block" style={{ color: 'var(--text-primary)' }}>
                    {projectsCount}+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 block" style={{ color: 'var(--accent)' }}>
                    PROJECTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Artwork */}
          <div className="lg:col-span-6 flex justify-center mt-4 lg:mt-0">
            <div className="relative w-full max-w-sm sm:max-w-lg">
              <div
                className="absolute -inset-2 rounded-3xl opacity-30 blur-2xl pointer-events-none"
                style={{ background: 'var(--accent)' }}
              />

              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden border shadow-xl transition-all duration-500 group"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <img
                  src={profile?.journey_image_url || "/assets/glowing_programmer.jpg"}
                  alt="Programmer coding"
                  className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div
                  className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-md border text-[10px] sm:text-xs gap-1 sm:gap-2"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                    <span className="font-semibold truncate">Turning logic into reality</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono" style={{ color: 'var(--accent)' }}>
                    Clean Code & Architecture
                  </span>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div
                className="absolute -top-3 -left-2 sm:-top-4 sm:-left-6 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border shadow-xl backdrop-blur-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--accent)'
                }}
              >
                <div className="flex items-center font-mono font-black text-xs sm:text-base gap-0.5" style={{ color: 'var(--accent)' }}>
                  <span>&lt;</span>
                  <span>/</span>
                  <span>&gt;</span>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div
                className="absolute -top-3 -right-2 sm:-top-5 sm:-right-5 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-sm shadow-xl border transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-inverted)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <span className="text-xs sm:text-base leading-none">C++</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>

              {/* Floating Badge 3 */}
              <div
                className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl border shadow-xl backdrop-blur-xl flex items-center justify-center transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-card)',
                  color: 'var(--text-primary)'
                }}
              >
                <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JourneySection;
