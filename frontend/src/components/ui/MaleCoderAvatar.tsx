import React from 'react';

interface MaleCoderAvatarProps {
  className?: string;
}

export const MaleCoderAvatar: React.FC<MaleCoderAvatarProps> = ({ className = "w-full h-full" }) => {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background soft dark radial */}
      <rect width="128" height="128" rx="28" fill="var(--color-bg)" />
      
      {/* Subtle Terminal Screen backdrop in avatar */}
      <rect x="14" y="16" width="100" height="96" rx="16" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="2" />
      <circle cx="26" cy="26" r="3" fill="#ef4444" />
      <circle cx="34" cy="26" r="3" fill="#eab308" />
      <circle cx="42" cy="26" r="3" fill="#10b981" />
      
      {/* Code syntax lines behind character */}
      <line x1="26" y1="38" x2="54" y2="38" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
      <line x1="58" y1="38" x2="74" y2="38" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <line x1="26" y1="46" x2="42" y2="46" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="88" y1="38" x2="102" y2="38" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Character Hair Back */}
      <path
        d="M40 58C40 40 50 34 64 34C78 34 88 40 88 58V68C88 68 84 74 80 74H48C44 74 40 68 40 68V58Z"
        fill="#18181b"
      />
      
      {/* Character Neck */}
      <path d="M58 84H70V94H58V84Z" fill="#fbcfe8" opacity="0.9" />

      {/* Character Face */}
      <path
        d="M46 54C46 44 54 42 64 42C74 42 82 44 82 54V68C82 78 74 86 64 86C54 86 46 78 46 68V54Z"
        fill="#fed7aa"
      />

      {/* Modern Coder Hair Cut */}
      <path
        d="M44 50C44 50 48 38 64 38C80 38 84 50 84 50C84 50 82 44 72 43C62 42 54 44 44 50Z"
        fill="#27272a"
      />
      <path
        d="M45 52C47 48 53 45 61 45C72 45 77 48 83 52C82 46 75 42 63 42C52 42 46 46 45 52Z"
        fill="#3f3f46"
      />

      {/* Stylish Glasses */}
      <rect x="49" y="58" width="12" height="9" rx="3" stroke="var(--color-accent)" strokeWidth="2" fill="var(--color-bg)" fillOpacity="0.4" />
      <rect x="67" y="58" width="12" height="9" rx="3" stroke="var(--color-accent)" strokeWidth="2" fill="var(--color-bg)" fillOpacity="0.4" />
      <line x1="61" y1="62" x2="67" y2="62" stroke="var(--color-accent)" strokeWidth="2" />
      <line x1="46" y1="61" x2="49" y2="61" stroke="var(--color-accent)" strokeWidth="1.5" />
      <line x1="79" y1="61" x2="82" y2="61" stroke="var(--color-accent)" strokeWidth="1.5" />
      
      {/* Eyes through glasses */}
      <circle cx="55" cy="62.5" r="1.5" fill="var(--color-text)" />
      <circle cx="73" cy="62.5" r="1.5" fill="var(--color-text)" />

      {/* Smile */}
      <path d="M60 74C62 76 66 76 68 74" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />

      {/* Headphones on ears */}
      <rect x="41" y="56" width="5" height="14" rx="2.5" fill="var(--color-accent)" />
      <rect x="82" y="56" width="5" height="14" rx="2.5" fill="var(--color-accent)" />
      <path d="M43 56C43 42 52 32 64 32C76 32 85 42 85 56" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hoodie / Shoulders */}
      <path
        d="M34 112C34 98 46 92 56 92H72C82 92 94 98 94 112V114H34V112Z"
        fill="#18181b"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      <path
        d="M52 92L60 106L64 100L68 106L76 92"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Laptop glow bar at bottom */}
      <rect x="42" y="108" width="44" height="4" rx="2" fill="var(--color-accent)" opacity="0.9" />
    </svg>
  );
};
