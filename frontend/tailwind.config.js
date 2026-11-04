/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'color-mix(in srgb, var(--color-bg) calc(<alpha-value> * 100%), transparent)',
        surface: 'color-mix(in srgb, var(--color-surface) calc(<alpha-value> * 100%), transparent)',
        'surface-hover': 'color-mix(in srgb, var(--color-surface-hover) calc(<alpha-value> * 100%), transparent)',
        border: 'color-mix(in srgb, var(--color-border) calc(<alpha-value> * 100%), transparent)',
        'border-subtle': 'color-mix(in srgb, var(--color-border-subtle) calc(<alpha-value> * 100%), transparent)',
        'text-main': 'color-mix(in srgb, var(--color-text) calc(<alpha-value> * 100%), transparent)',
        'text-muted': 'color-mix(in srgb, var(--color-text-muted) calc(<alpha-value> * 100%), transparent)',
        accent: {
          DEFAULT: 'color-mix(in srgb, var(--color-accent) calc(<alpha-value> * 100%), transparent)',
          hover: 'color-mix(in srgb, var(--color-accent-hover) calc(<alpha-value> * 100%), transparent)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
