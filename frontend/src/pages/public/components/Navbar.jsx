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
  Home,
  User,
  BookOpen,
  MessageCircle,
  FileText,
  Palette,
  Star,
  Check,
} from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { isColorLight } from '../../../utils/themeEngine';
import api from '../../../utils/api';
import GithubIcon from '../../../components/icons/GithubIcon';

const Navbar = ({ profile }) => {
  const {
    activeTheme,
    setCustomTheme,
    toggleTheme,
    availableThemes,
    setAvailableThemes,
    primaryThemeId
  } = useThemeStore();
  const token = useAuthStore((state) => state.token);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [savingPrimaryId, setSavingPrimaryId] = useState(null);
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    if (!availableThemes || availableThemes.length === 0) {
      api.get('/themes').then((res) => {
        if (res.data?.themes && res.data.themes.length > 0) {
          setAvailableThemes(res.data.themes, res.data.activeTheme?.id);
        }
      }).catch(() => {});
    }
  }, [availableThemes, setAvailableThemes]);

  const handleSetPrimary = async (e, themeItem) => {
    e.stopPropagation();
    if (!themeItem.id) return;
    try {
      setSavingPrimaryId(themeItem.id);
      const res = await api.patch(`/admin/themes/${themeItem.id}/activate`, {});
      if (res.data) {
        setCustomTheme(res.data);
        const updated = (availableThemes || []).map((item) => ({
          ...item,
          is_active: item.id === themeItem.id
        }));
        setAvailableThemes(updated, themeItem.id);
      }
    } catch (err) {
      console.error('Failed to set primary theme:', err);
      alert('Error setting primary theme. Please make sure you are logged in as admin.');
    } finally {
      setSavingPrimaryId(null);
    }
  };

  const defaultThemesFallback = [
    {
      id: 1,
      name: 'Dark (Default)',
      accent: '#00e5a0',
      bg_base: '#030712',
      bg_surface: '#0f172a',
      text_primary: '#f8fafc',
      bg_type: 'NEURON',
      is_active: true
    },
    {
      id: 2,
      name: 'Light (Default)',
      accent: '#0d9488',
      bg_base: '#f8fafc',
      bg_surface: '#ffffff',
      text_primary: '#0f172a',
      bg_type: 'NEURON',
      is_active: false
    }
  ];

  const themesList = availableThemes && availableThemes.length > 0 ? availableThemes : defaultThemesFallback;

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
    <header className="sticky top-3 sm:top-4 z-50 w-[94%] sm:w-[90%] max-w-7xl mx-auto" ref={navRef}>
      <nav className="glass-panel rounded-2xl px-4 sm:px-5 md:px-7 py-3 sm:py-3.5 flex items-center justify-between">
        
        {/* Brand Logo with Glowing Avatar & sakil.me */}
        <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative">
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-105"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: 'var(--accent-glow)'
              }}
            >
              {(profile?.icon_image_url || profile?.profile_image_url) ? (
                <img
                  src={profile.icon_image_url || profile.profile_image_url}
                  alt={profile?.full_name || 'Sakil Ahmed'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
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
                    <Code2 className="w-4 h-4 text-accent" />
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
                    <Briefcase className="w-4 h-4 text-accent" />
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
          {/* Theme Dropdown (Hover with duration like expertise & career) */}
          <div
            className="relative py-1"
            onMouseEnter={() => handleMouseEnter('theme')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'theme' ? null : 'theme')}
              className="p-2 rounded-xl border border-white/10 hover:border-accent transition-all backdrop-blur-sm cursor-pointer flex items-center gap-1.5"
              style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
              title="Themes & Appearance"
            >
              {activeTheme?.bg_base && isColorLight(activeTheme.bg_base) ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-accent" />
              )}
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-60 ${activeDropdown === 'theme' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'theme' && (
              <div
                className="absolute top-full right-0 pt-2 w-72 sm:w-80 z-50"
                onMouseEnter={() => handleMouseEnter('theme')}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="rounded-2xl glass p-3 sm:p-3.5 shadow-2xl border border-white/10 backdrop-blur-2xl animate-in fade-in duration-150 space-y-2.5"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-accent" />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                        Theme Presets
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition cursor-pointer"
                      style={{ color: 'var(--text-secondary)' }}
                      title="Quick toggle dark / light mode"
                    >
                      {activeTheme?.bg_base && isColorLight(activeTheme.bg_base) ? '☾ Dark' : '☀ Light'}
                    </button>
                  </div>

                  {/* List of saved themes from database */}
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="space-y-1.5 max-h-64 overflow-y-auto pr-0.5 overscroll-contain"
                  >
                    {themesList.map((t) => {
                      const isCurrentlySelected = activeTheme?.id === t.id || activeTheme?.name === t.name;
                      const isPrimary = t.is_active || t.id === primaryThemeId;
                      return (
                        <div
                          key={t.id || t.name}
                          onClick={() => {
                            setCustomTheme(t);
                          }}
                          className={`group/item p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                            isCurrentlySelected
                              ? 'border-accent shadow-[0_0_12px_var(--accent-glow)]'
                              : 'border-white/5 hover:border-white/20 bg-white/5'
                          }`}
                          style={{
                            backgroundColor: isCurrentlySelected ? 'var(--bg-surface-hover)' : 'transparent'
                          }}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* 4-color mini swatch */}
                            <div className="flex items-center gap-0.5 p-1 rounded-lg border border-white/10 bg-black/20 shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: t.bg_base }} title={`Base: ${t.bg_base}`} />
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: t.bg_surface }} title={`Surface: ${t.bg_surface}`} />
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: t.text_primary }} title={`Text: ${t.text_primary}`} />
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: t.accent }} title={`Accent: ${t.accent}`} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                  {t.name}
                                </span>
                                {isPrimary && (
                                  <span
                                    className="text-[9px] font-semibold px-1.5 py-0.2 rounded border shrink-0 uppercase tracking-wider"
                                    style={{ borderColor: 'var(--accent-dim)', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
                                    title="Default primary theme for all visitors"
                                  >
                                    Primary
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] block truncate" style={{ color: 'var(--text-muted)' }}>
                                {t.bg_type === 'FLAT' ? 'Flat Custom CSS' : 'Interactive Neuron'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Option to make primary for all visitors */}
                            {token ? (
                              <button
                                type="button"
                                disabled={savingPrimaryId === t.id}
                                onClick={(e) => handleSetPrimary(e, t)}
                                title={isPrimary ? 'Current primary default for all visitors' : 'Make primary default for all visitors'}
                                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                  isPrimary
                                    ? 'border-accent bg-accent/20 text-accent'
                                    : 'border-white/10 hover:border-accent hover:text-accent text-gray-400'
                                }`}
                              >
                                <Star className={`w-3.5 h-3.5 ${isPrimary ? 'fill-current' : ''}`} />
                              </button>
                            ) : (
                              isPrimary && (
                                <Star className="w-3.5 h-3.5 text-accent fill-current mr-0.5" title="Primary default theme for all visitors" />
                              )
                            )}

                            {isCurrentlySelected && (
                              <Check className="w-4 h-4 text-accent ml-1" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] px-1" style={{ color: 'var(--text-muted)' }}>
                    <span>Click to switch theme</span>
                    <span className="opacity-70 font-mono text-[10px]">
                      {themesList.length} themes
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CV Button (Desktop) */}
          <a
            href={profile?.resume_drive_link || profile?.resume_url || '#contact'}
            target={(profile?.resume_drive_link || profile?.resume_url) ? '_blank' : undefined}
            rel="noreferrer"
            className="hidden sm:inline-flex px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
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
            className="md:hidden p-2 rounded-xl border border-white/10 hover:border-accent/40 transition-all cursor-pointer"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </nav>

      {/* Mobile Full List Menu (All shown as list with icons, max-height scrolling, touch safe) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-2xl p-3 border border-white/10 shadow-2xl backdrop-blur-2xl max-h-[82vh] overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Home className="w-4 h-4 text-accent shrink-0" />
              <span>Home</span>
            </a>
            <a
              href="#journey"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <User className="w-4 h-4 text-accent shrink-0" />
              <span>About</span>
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Code2 className="w-4 h-4 text-accent shrink-0" />
              <span>Skills</span>
            </a>
            <a
              href="#problem-solving"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Terminal className="w-4 h-4 text-accent shrink-0" />
              <span>Problem Solving</span>
            </a>
            <a
              href="#github"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <GithubIcon className="w-4 h-4 text-accent shrink-0" />
              <span>GitHub Contribution</span>
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <GraduationCap className="w-4 h-4 text-accent shrink-0" />
              <span>Education & Experience</span>
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Briefcase className="w-4 h-4 text-accent shrink-0" />
              <span>Projects</span>
            </a>
            <a
              href="#blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <BookOpen className="w-4 h-4 text-accent shrink-0" />
              <span>Blogs</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 hover:bg-white/10 active:bg-white/15 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <MessageCircle className="w-4 h-4 text-accent shrink-0" />
              <span>Contact</span>
            </a>

            {/* Mobile Themes Switcher */}
            <div className="pt-3 pb-1 border-t border-white/10">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Theme Presets</span>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-white/10 bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {activeTheme?.bg_base && isColorLight(activeTheme.bg_base) ? '☾ Dark' : '☀ Light'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {themesList.map((t) => {
                  const isCurrentlySelected = activeTheme?.id === t.id || activeTheme?.name === t.name;
                  const isPrimary = t.is_active || t.id === primaryThemeId;
                  return (
                    <button
                      key={t.id || t.name}
                      type="button"
                      onClick={() => setCustomTheme(t)}
                      className={`p-2 rounded-xl text-left border text-xs flex items-center justify-between gap-1 transition ${
                        isCurrentlySelected ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: t.accent }} />
                        <span className="truncate font-semibold text-[11px]" style={{ color: 'var(--text-primary)' }}>
                          {t.name}
                        </span>
                      </div>
                      {isCurrentlySelected && <Check className="w-3 h-3 text-accent shrink-0" />}
                      {!isCurrentlySelected && isPrimary && <Star className="w-3 h-3 text-accent fill-current shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <a
                href={profile?.resume_drive_link || profile?.resume_url || '#contact'}
                target={(profile?.resume_drive_link || profile?.resume_url) ? '_blank' : undefined}
                rel="noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-inverted)',
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
