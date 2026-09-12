import { Sparkles, Briefcase, Layers, Code2, FileText } from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';
import SocialIcon from '../../../components/icons/SocialIcon';

const HeroSection = ({ profile, projects, skills, stats, socialLinks, blogs }) => {
  const calculateExperienceYears = (start) => {
    if (!start) return 0;
    const diff = new Date() - new Date(start);
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
  };

  const fullName = profile?.full_name || 'Sakil Ahmed';

  const projectsCount = projects?.length || 0;
  const skillsCount = skills?.length || 0;
  const programmingLanguagesCount = (skills || []).filter(
    (s) => s.category === 'PROGRAMMING_LANGUAGE'
  ).length;
  const publishedBlogsCount = (blogs || []).filter(
    (b) => b.is_published !== false
  ).length;

  return (
    <section id="home" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto py-10 sm:py-16 md:py-28 scroll-mt-28">
      <div id="about" className="scroll-mt-28" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Hero Column */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 w-fit">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            HELLO! • I AM
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight sm:leading-none mb-3 sm:mb-4 text-white">
            {fullName}
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--accent)' }}>
            {profile?.role || profile?.title || 'Full Stack Developer'}
          </h2>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            {profile?.bio || 'Building scalable, modern and performant web applications.'}
          </p>

          {/* CTAs & Socials */}
          <div className="flex flex-wrap gap-3 sm:gap-4 items-center mb-8 sm:mb-10">
            <a
              href="#projects"
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 text-center"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text-inverted)',
              }}
            >
              View Works
            </a>

            <a
              href={profile?.resume_drive_link || profile?.resume_url || '#contact'}
              target={(profile?.resume_drive_link || profile?.resume_url) ? '_blank' : undefined}
              rel={(profile?.resume_drive_link || profile?.resume_url) ? 'noreferrer' : undefined}
              className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-white/10 font-bold text-xs sm:text-sm tracking-wide hover:border-teal-400/40 text-gray-300 hover:text-white transition-all transform hover:-translate-y-0.5 active:scale-95 text-center backdrop-blur-sm shadow-md"
              style={{ background: 'rgba(255, 255, 255, 0.05)' }}
            >
              Download CV
            </a>

            {/* Social links */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              {socialLinks?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 flex items-center justify-center text-gray-300 hover:text-teal-400 hover:border-teal-400/40 transition-all backdrop-blur-sm shrink-0"
                  style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  title={link.platform}
                >
                  <SocialIcon 
                    platform={link.platform} 
                    iconName={link.icon_name} 
                    iconUrl={link.icon_url} 
                    iconType={link.icon_type} 
                    className="w-4 h-4" 
                  />
                </a>
              ))}
            </div>
          </div>

          {/* 4 Key Stats Cards with Rectangular Landscape Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-3xl">
            {/* Card 1: Projects Count */}
            <div className="p-3 sm:p-3.5 rounded-2xl hero-card flex items-center gap-3 sm:gap-3.5 group transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/25 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 group-hover:border-teal-400/50 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-0.5">
                  {projectsCount}+
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--text-muted)' }}>
                  Projects
                </p>
              </div>
            </div>

            {/* Card 2: Total Skills Count */}
            <div className="p-3 sm:p-3.5 rounded-2xl hero-card flex items-center gap-3 sm:gap-3.5 group transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 group-hover:border-cyan-400/50 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-0.5">
                  {skillsCount}+
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--text-muted)' }}>
                  Total Skills
                </p>
              </div>
            </div>

            {/* Card 3: Programming Languages Count */}
            <div className="p-3 sm:p-3.5 rounded-2xl hero-card flex items-center gap-3 sm:gap-3.5 group transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/25 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 group-hover:border-teal-400/50 transition">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold text-teal-400 leading-tight mb-0.5">
                  {programmingLanguagesCount}+
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--text-muted)' }}>
                  Languages
                </p>
              </div>
            </div>

            {/* Card 4: Published Blogs Count */}
            <div className="p-3 sm:p-3.5 rounded-2xl hero-card flex items-center gap-3 sm:gap-3.5 group transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 group-hover:border-cyan-400/50 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold text-teal-400 leading-tight mb-0.5">
                  {publishedBlogsCount}+
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold truncate" style={{ color: 'var(--text-muted)' }}>
                  Blogs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Column: Profile Image */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500 to-cyan-500 opacity-25 blur-xl group-hover:opacity-60 transition duration-700 pointer-events-none" />
            
            {(profile?.hero_image_url || profile?.profile_image_url) ? (
              <img
                src={profile.hero_image_url || profile.profile_image_url}
                alt={fullName}
                className="relative w-full max-w-[260px] xs:max-w-[280px] sm:max-w-sm md:max-w-md object-cover rounded-3xl shadow-2xl border border-white/15 aspect-[4/5] group-hover:border-teal-400/60 group-hover:shadow-[0_0_40px_rgba(0,229,160,0.3)] transition-all duration-500"
              />
            ) : (
              <div className="relative w-64 sm:w-80 aspect-[4/5] rounded-3xl border border-white/15 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-gray-400 group-hover:border-teal-400/50 transition-all duration-300" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 mb-4">
                  <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <p className="text-xs sm:text-sm font-medium">Upload your profile image in the Admin Panel</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
