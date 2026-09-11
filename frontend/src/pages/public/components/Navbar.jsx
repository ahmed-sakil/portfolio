import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Code2,
  Terminal,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import GithubIcon from '../../../components/icons/GithubIcon';

const Navbar = ({ profile }) => {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = (dropdownName) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const closeImmediately = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeImmediately();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-4 z-50 w-[90%] max-w-7xl mx-auto" ref={navRef}>
      <nav className="glass-panel rounded-2xl px-5 md:px-7 py-3.5 flex items-center justify-between">
        
        {/* Brand Logo with Glowing Avatar & sakil.me */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-teal-400/40 group-hover:border-teal-400 group-hover:shadow-[0_0_16px_rgba(0,229,160,0.8)] transition-all duration-300">
              {(profile?.icon_image_url || profile?.profile_image_url) ? (
                <img
                  src={profile.icon_image_url || profile.profile_image_url}
                  alt={profile?.full_name || 'Sakil Ahmed'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-teal-400/20 flex items-center justify-center text-xs font-bold text-teal-400">
                  S
                </div>
              )}
            </div>
          </div>
          <span className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            sakil<span style={{ color: 'var(--accent)' }}>.me</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#home"
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Home
          </a>

          <a
            href="#journey"
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            About
          </a>

          {/* Expertise Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('expertise')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'expertise' ? null : 'expertise')}
              className="flex items-center gap-1 text-sm font-semibold transition-colors duration-200"
              style={{ color: activeDropdown === 'expertise' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              Expertise
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'expertise' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'expertise' && (
              <div
                className="absolute top-full left-0 pt-2 w-52 z-50"
                onMouseEnter={() => handleMouseEnter('expertise')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="rounded-2xl glass p-2 shadow-2xl border border-white/10 backdrop-blur-2xl animate-in fade-in duration-150">
                  <a
                    href="#skills"
                    onClick={closeImmediately}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Code2 className="w-4 h-4 text-teal-400" />
                    Skills
                  </a>
                  <a
                    href="#problem-solving"
                    onClick={closeImmediately}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Terminal className="w-4 h-4 text-yellow-400" />
                    Problem Solving
                  </a>
                  <a
                    href="#github"
                    onClick={closeImmediately}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <GithubIcon className="w-4 h-4 text-blue-400" />
                    GitHub Contribution
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Career Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => handleMouseEnter('career')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'career' ? null : 'career')}
              className="flex items-center gap-1 text-sm font-semibold transition-colors duration-200"
              style={{ color: activeDropdown === 'career' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              Career
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'career' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'career' && (
              <div
                className="absolute top-full left-0 pt-2 w-56 z-50"
                onMouseEnter={() => handleMouseEnter('career')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="rounded-2xl glass p-2 shadow-2xl border border-white/10 backdrop-blur-2xl animate-in fade-in duration-150">
                  <a
                    href="#experience"
                    onClick={closeImmediately}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    Education & Experience
                  </a>
                  <a
                    href="#projects"
                    onClick={closeImmediately}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <Briefcase className="w-4 h-4 text-teal-400" />
                    Projects
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href="#blogs"
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Blogs
          </a>

          <a
            href="#contact"
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Contact
          </a>
        </div>

        {/* Right Actions: Theme Toggle + CV Option */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 hover:border-teal-400/40 transition-all backdrop-blur-sm"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
            title={`Switch to ${theme === 'dark' ? 'Bright' : 'Dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
          </button>

          {/* CV Button (Desktop) */}
          <a
            href={profile?.resume_drive_link || profile?.resume_url || '#contact'}
            target={(profile?.resume_drive_link || profile?.resume_url) ? '_blank' : undefined}
            rel="noreferrer"
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-inverted)',
            }}
          >
            CV
          </a>

          {/* Hamburger button (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-white/10 hover:border-teal-400/40 transition-all"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Full List Menu (All shown as list, no nested dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass rounded-2xl p-4 border border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Home
            </a>
            <a
              href="#journey"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              About
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Skills
            </a>
            <a
              href="#problem-solving"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Problem Solving
            </a>
            <a
              href="#github"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              GitHub Contribution
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Education & Experience
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Projects
            </a>
            <a
              href="#blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Blogs
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              Contact
            </a>

            <div className="pt-2">
              <a
                href={profile?.resume_drive_link || profile?.resume_url || '#contact'}
                target={(profile?.resume_drive_link || profile?.resume_url) ? '_blank' : undefined}
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold rounded-xl text-center block transition-all shadow-md"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-inverted)',
                }}
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
