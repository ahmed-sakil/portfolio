import { Sparkles, Code2 } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';

const DEFAULT_JOURNEY_PARAGRAPHS = [
  "After SSC, moving to Dhaka and getting WiFi sparked my interest in programming. Out of curiosity and a desire to create, I started building small web pages using HTML. At first, it was simple experimentation, but I was fascinated by how people could build such beautiful websites and wanted to learn more.",
  "Gradually, I learned JavaScript, React, and modern backend architectures. Through continuous learning, practice, and experimentation, I became proficient in web development and am now able to create and implement complete full-stack applications and scalable solutions."
];

const JourneySection = ({ profile, projects = [] }) => {
  const yearsExp = profile?.years_of_experience ?? 1;
  const projectsCount = projects && projects.length > 0 ? projects.length : 19;

  // Split journey text by double newlines into paragraphs, or fallback
  const rawText = profile?.journey_text || profile?.bio;
  const paragraphs = rawText
    ? rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    : DEFAULT_JOURNEY_PARAGRAPHS;

  return (
    <section id="journey" className="w-[90%] max-w-7xl mx-auto mb-28 md:mb-36 scroll-mt-28">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden">
        {/* Section Header: Title & One Line Description */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            The <span style={{ color: 'var(--accent)' }}>Journey</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            From initial curiosity to architecting scalable full-stack applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Narrative Card */}
        <div className="lg:col-span-6">
          <div
            className="rounded-3xl border border-white/10 p-7 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl flex flex-col justify-between"
            style={{
              background: 'linear-gradient(180deg, rgba(16, 20, 32, 0.85) 0%, rgba(10, 14, 24, 0.92) 100%)',
              boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Ambient subtle glow inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Paragraphs */}
            <div className="space-y-5 text-sm sm:text-base leading-relaxed text-gray-300 font-normal relative z-10">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Bottom Key Stats Row (matching reference screenshot) */}
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-10 sm:gap-16 relative z-10">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {yearsExp}+
                </span>
                <span className="text-[11px] font-bold tracking-wider text-teal-400 uppercase mt-1 block">
                  YEARS EXP.
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {projectsCount}+
                </span>
                <span className="text-[11px] font-bold tracking-wider text-teal-400 uppercase mt-1 block">
                  PROJECTS
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Glowing Programmer Artwork & Floating 3D Tech Badges */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-lg">
            
            {/* Ambient neon purple and teal glow halo */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600/30 via-teal-500/20 to-blue-500/30 blur-2xl opacity-60 animate-pulse pointer-events-none" />

            {/* Main Glowing Programmer Frame */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] hover:border-teal-400/50 hover:shadow-[0_0_60px_rgba(0,229,160,0.3)] transition-all duration-500 group">
              <img
                src={profile?.journey_image_url || "/assets/glowing_programmer.jpg"}
                alt="Programmer coding with glowing holographic displays"
                className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Bottom Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 via-transparent to-transparent pointer-events-none" />

              {/* Inset Label Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="font-semibold text-white">Turning logic into reality</span>
                </div>
                <span className="text-[11px] font-mono text-purple-300">Clean Code & Architecture</span>
              </div>
            </div>

            {/* Floating 3D Style Badge 1: Code < / > Badge (Top Left) */}
            <div className="absolute -top-4 -left-4 sm:-left-6 p-3 sm:p-3.5 rounded-2xl bg-[#14192b]/95 border-2 border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.4)] backdrop-blur-xl flex items-center justify-center text-teal-300 transform -rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
              <div className="flex items-center font-mono font-black text-sm sm:text-base text-teal-400 gap-0.5">
                <span>&lt;</span>
                <span className="text-purple-400">/</span>
                <span>&gt;</span>
              </div>
            </div>

            {/* Floating 3D Style Badge 2: C++ Hexagon Badge (Top Right) */}
            <div className="absolute -top-5 -right-3 sm:-right-5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(59,130,246,0.4)] border border-white/20 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer flex items-center gap-1.5">
              <span className="text-base leading-none">C++</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Floating 3D Style Badge 3: GitHub Octocat Badge (Bottom Right) */}
            <div className="absolute -bottom-4 -right-3 sm:-right-4 p-3 rounded-2xl bg-[#121624]/95 border border-white/15 shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-center text-white transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer">
              <GithubIcon className="w-5 h-5 text-gray-200" />
            </div>

          </div>
        </div>

        </div>
      </div>
    </section>
  );
};

export default JourneySection;
