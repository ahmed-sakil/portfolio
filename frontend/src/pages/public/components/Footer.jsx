import { Mail, Phone, MapPin, ArrowUpRight, ArrowUp } from 'lucide-react';
import SocialIcon from '../../../components/icons/SocialIcon';

const DEFAULT_SOCIALS = [
  { name: 'GitHub', url: 'https://github.com', icon_name: 'github' },
  { name: 'LinkedIn', url: 'https://linkedin.com', icon_name: 'linkedin' },
  { name: 'LeetCode', url: 'https://leetcode.com', icon_name: 'leetcode' },
  { name: 'Codeforces', url: 'https://codeforces.com', icon_name: 'codeforces' },
  { name: 'Twitter / X', url: 'https://x.com', icon_name: 'x' },
];

const Footer = ({ profile, socialLinks = [] }) => {
  const email = profile?.email || 'contact@sakil.me';
  const phone = profile?.phone || '+880 1700-000000';
  const location = profile?.location || 'Dhaka, Bangladesh';

  // Prepare social links: read the database field `platform` (or fall back to `name`)
  let displaySocials = [];
  if (socialLinks && socialLinks.length > 0) {
    displaySocials = socialLinks.map((s) => ({
      name: s.platform || s.name || s.platform_name || 'Social Link',
      url: s.url || s.link || '#',
      icon_name: s.icon_name || null,
    }));
  } else {
    displaySocials = [
      {
        name: 'GitHub',
        url: `https://github.com/${profile?.github_username || 'protik0939'}`,
        icon_name: 'github',
      },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon_name: 'linkedin' },
      {
        name: 'LeetCode',
        url: `https://leetcode.com/u/${profile?.leetcode_username || 'sakil'}`,
        icon_name: 'leetcode',
      },
      {
        name: 'Codeforces',
        url: `https://codeforces.com/profile/${profile?.codeforces_username || 'sakil'}`,
        icon_name: 'codeforces',
      },
      { name: 'Twitter / X', url: 'https://x.com', icon_name: 'x' },
    ];
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-12 sm:mb-16 scroll-mt-28">
      {/* Uniform Glass Panel Container */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 relative overflow-hidden">
        {/* Ambient subtle glow elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 pb-8 sm:pb-12 border-b border-white/10">
          {/* Column 1: Brand & Direct Contact Info (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400/50 shadow-[0_0_15px_rgba(0,229,160,0.4)]">
                {profile?.icon_image_url || profile?.profile_image_url ? (
                  <img
                    src={profile.icon_image_url || profile.profile_image_url}
                    alt={profile?.full_name || 'Sakil Ahmed'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-teal-400/20 flex items-center justify-center text-sm font-bold text-teal-400">
                    S
                  </div>
                )}
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                sakil<span style={{ color: 'var(--accent)' }}>.me</span>
              </span>
            </div>

            <p
              className="text-sm leading-relaxed max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              {profile?.role || profile?.title || 'Full Stack Developer'} —{' '}
              {profile?.bio ||
                'Building scalable, modern, and performant web applications with clean architecture and delightful user experiences.'}
            </p>

            {/* Direct Contact List (Email, Phone, Location) */}
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-sm font-medium hover:text-teal-400 transition group"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-teal-400/40 group-hover:bg-teal-400/10 transition">
                  <Mail className="w-4 h-4 text-teal-400" />
                </div>
                <span>{email}</span>
              </a>

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-sm font-medium hover:text-teal-400 transition group"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-teal-400/40 group-hover:bg-teal-400/10 transition">
                    <Phone className="w-4 h-4 text-teal-400" />
                  </div>
                  <span>{phone}</span>
                </a>
              )}

              {location && (
                <div
                  className="flex items-center gap-3 text-sm font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Social Media Links with Names & Icons from Database (Col 6) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold tracking-wider uppercase text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Connect & Social
              </h4>
              <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                Find and follow my profiles across the web.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displaySocials.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-teal-400/10 hover:border-teal-400/50 hover:shadow-[0_0_20px_rgba(0,229,160,0.18)] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 group-hover:bg-teal-400/20 group-hover:border-teal-400/40 transition shrink-0">
                        <SocialIcon
                          platform={item.name}
                          iconName={item.icon_name}
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-200 group-hover:text-white transition truncate">
                        {item.name}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top Bar */}
        <div
          className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <p>
            © {new Date().getFullYear()} {profile?.full_name || 'Sakil Ahmed'}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-teal-400/50 hover:bg-teal-400/10 transition group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-teal-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
