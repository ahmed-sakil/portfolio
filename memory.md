# Portfolio Architecture & Decision Memory

*Last Updated: 2026-10-13*

This document serves as the single source of truth for architectural choices, design philosophy, technical stack, and UX requirements discussed for the portfolio project.

---

## 1. High-Level Vision & Concept
- **Product**: A minimalist, high-performance, pro-developer portfolio with an integrated admin panel.
- **Visual Style (Inspired by Reference UI)**:
  - Deep dark theme with crisp `1px` borders and subtle contrast (`--color-surface`, `--color-border`).
  - Section dividers with minimalist glyphs (e.g. `★ ABOUT`, `* Information`, `* Experiences`, `★ SKILLS`).
  - Rounded pill cards for dense, clean information presentation (company tags, tech stack badges with icons).
- **Form Factor & Navigation**:
  - **Single Page Application (SPA)** with a continuous, buttery canvas.
  - **Large Screens (Desktop)**: Dedicated docked sidebar (profile avatar, name, designation, section navigation buttons like About, Skills, Projects, Contact).
  - **Mobile Screens**: Native mobile app-style **bottom navigation bar** + **burger menu** that expands the sidebar/profile drawer.
  - **Case Study View**: Minimalist slide-over / fullscreen sheet for deep project exploration without leaving the context.
- **Feel & Motion**:
  - **Lenis Smooth Momentum Scrolling** (smooth glide and deceleration stops).
  - Fast, responsive hover states; zero layout shifts.

---

## 2. Tech Stack & Deployment Mapping (Free Tier)
- **Frontend**:
  - **React + Vite (TypeScript)**
  - **Tailwind CSS** with centralized CSS-variable theme engine
  - **Lenis** for momentum smooth scrolling
  - **TanStack Query (React Query)** for instant client-side caching & hover-prefetching
  - **Lucide React** for clean minimalist iconography
  - **Deployment**: Vercel / GitHub Pages
- **Backend**:
  - **Node.js v22 (via NVM) + Express (TypeScript)**
  - Feature-sliced / vertical slice architecture
  - **Deployment**: Render (Free Tier Web Service)
  - **Auto Database Push on Deploy**: Build script configured to run `prisma db push` / `prisma migrate deploy` automatically before server startup!
- **Database & ORM**:
  - **PostgreSQL**: Local dev (`postgresql://postgres:sakill@localhost:5432/portfolio_db`) & Neon Serverless PostgreSQL for production.
  - **Prisma**: Fixed to stable Prisma `^6.4.0` / 7.x (strictly avoiding experimental v8).
- **Directory Layout**:
  - Root directory with strictly segregated `/frontend` and `/backend`


---

## 3. Strict, Predictable File Structure (Zero Token Waste)
To ensure fast navigation, low token usage, and isolated feature editing:

```text
portfolio/
├── memory.md                   # Single source of truth for decisions
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database models (User, Theme, Project, Skill, Experience, Message)
│   │   └── seed.ts             # Initial admin seed & default themes
│   └── src/
│       ├── core/               # db.ts (Prisma client), config.ts (env), middleware/ (auth, error)
│       └── features/           # Completely isolated feature modules
│           ├── auth/           # routes, controller, service, validation
│           ├── themes/         # routes, controller, service (CRUD & active theme)
│           ├── projects/       # routes, controller, service (projects & case studies)
│           ├── profile/        # routes, controller, service (bio, experience, skills)
│           └── messages/       # routes, controller, service (contact inbox)
│
└── frontend/
    └── src/
        ├── app/                # Router, providers (QueryClient, Lenis, ThemeProvider)
        ├── styles/             # globals.css, theme-tokens.css
        ├── components/
        │   ├── layout/         # DesktopSidebar, MobileBottomNav, MobileDrawer, Shell
        │   └── ui/             # Pure atomic primitives: Button, Card, Badge, Modal, Input
        └── features/           # Independent feature modules (UI + data hook)
            ├── themes/         # ThemeSelector, useThemes hook, theme switcher logic
            ├── projects/       # ProjectCard, ProjectGrid, ProjectDetailModal, useProjects hook
            ├── profile/        # AboutSection, ExperienceList, SkillsGrid, useProfile hook
            ├── contact/        # ContactForm, useSendMessage hook
            └── admin/          # AdminLayout, ThemeEditor, ProjectEditor, InboxViewer
```

---

## 4. Centralized Dynamic Theme Engine
- **5 Core CSS Variables**:
  1. `--color-bg`: Canvas background
  2. `--color-surface`: Card/modal/sheet background
  3. `--color-border`: Hairline subtle border
  4. `--color-text`: Primary text & `--color-text-muted` for descriptions
  5. `--color-accent`: Highlight / badge / interactive state
- **Visitor Experience**:
  - Theme switcher available in the sidebar/bottom-nav to pick from admin-published themes.
  - Persisted in `localStorage`.
- **Admin Experience**:
  - Create / edit themes with live color picker at `/admin/themes`.
  - Designate default theme for new visitors.

---

## 5. Performance Strategy (100+ Projects Scale)
- **Initial payload**: Only lightweight metadata of featured projects (~10-20KB).
- **Offscreen images**: Native `loading="lazy"` + skeleton placeholders.
- **Detail modal**: Fetched on-demand (with hover pre-fetching for instant open).
- **Catalog modal/view**: Paginated or chunked rendering with instant client-side tag filtering.

---

## 6. Security & Admin Entrance
- Single-admin only (prevent unauthorized registrations).
- Hidden admin path (e.g., `/admin/login404` or env-configured route).
- JWT authentication with bcrypt password verification.

---

## 7. Cloudinary Media Integration
- **Storage Provider**: Cloudinary
- **Cloud Name**: `zagrmuva`
- **API Key**: `892572139489195`
- **API Secret**: Configured via `.env` (`CLOUDINARY_API_SECRET`)
- **Upload Flow**: Admin panel sends multipart image upload to backend `/api/upload` endpoint, backend streams to Cloudinary and returns secure URL. Optimized WebP/auto delivery.

