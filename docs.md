# Developer Portfolio: System Documentation & Feature Manual

*Last Updated: 2026-10-13*

This document provides a complete technical guide for all recently developed features, architectural systems, database structures, and runtime mechanics for the portfolio project.

---

## 1. Dynamic Font System
- **Supported Developer Fonts**:
  1. `JetBrains Mono` (JetBrains official programming font, default)
  2. `Fira Code` (Mozilla's code font with programming ligatures)
  3. `Geist Mono` (Vercel modern engineering monospace)
  4. `Space Mono` (Retro typewriter monospace)
  5. `Inter Sans` (Clean contemporary interface sans-serif)
- **How it works**:
  - Fonts are loaded via Google Fonts CDN in [frontend/index.html](file:///home/sakil/Desktop/portfolio/frontend/index.html).
  - Selected font is stored in the `Profile` database table as `fontFamily`.
  - When the portfolio loads, [PortfolioHome.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/PortfolioHome.tsx) dynamically applies `--font-portfolio` to `document.documentElement.style`.
  - Admin can switch the active font with one click from the Admin Console under **Bio, Skills, Education & Fonts**.

---

## 2. Barcode Title Separator Design
- **Visual Effect**:
  - Rather than a plain solid line, section headers feature a barcode-style pattern (`repeating-linear-gradient` with alternating widths and opacity).
  - In [SectionHeader.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/components/ui/SectionHeader.tsx), this displays an upper barcode tag with hexadecimal length identifiers (`0x...`), followed by a full-width subtle barcode divider bar.

---

## 3. Experience & Education Architecture
- **Database Schema**:
  - `Experience`: `company`, `role`, `location`, `startDate`, `endDate`, `current`, `logoUrl`, `description`, `order`.
  - `Education`: `institution`, `degree`, `field`, `startDate`, `endDate`, `current`, `grade`, `location`, `logoUrl`, `description`, `order`.
- **Chronological Ordering**:
  - Automatically queries and displays organizations by latest starting year first (`orderBy: [{ startDate: 'desc' }, { order: 'asc' }]`).
- **Public View**:
  - Rendered side-by-side in [ExperienceEducationSection.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/features/profile/ExperienceEducationSection.tsx) under `// timeline`.
  - If a `logoUrl` exists, displays the official institute/company image; otherwise falls back to a minimal SVG icon.
  - Displays dates, roles, locations, grades, and rich highlights/descriptions.
- **Admin Panel**:
  - Under `/admin/dashboard` -> **Bio, Skills, Education & Fonts**, admins can create, edit, delete, and upload logos directly to Cloudinary.
  - Complete inputs for **Location / Campus** and **Description / Key Highlights** for both Experience and Education entries.

---

## 4. Full-Page Smooth Transitions, Targeted Inertial Scrolling & Stacked Slide-Over Architecture
- **The Problem**: Global window-level scroll libraries caused conflicts and blocked inner scroll areas. Furthermore, navigating from the "All Projects" catalog view into a specific project detail case study previously replaced the component in-place without the slide-from-right animation, and closing it dumped the user back to the overview instead of back to the catalog.
- **The Solution**:
  1. **Targeted Inertial Smooth Scrolling**: Integrated Lenis specifically bound to the `#main-content-scroll` wrapper element (with `#main-content-inner` as content). This restores the smooth, gliding momentum scroll physics and exponential deceleration curves on mouse wheel and trackpads, without intercepting window events or blocking admin panels, modals, and lists.
  2. **Lenis-Powered Section Jumps**: Sidebar and mobile drawer navigation triggers `lenis.scrollTo('#' + sectionId, { duration: 1.2, offset: -20 })`, delivering silky smooth glides down to targeted sections.
  3. **Stacked Slide-Over Panels (Layers 1 & 2)**:
     - **Layer 0 (Canvas)**: Overview canvas is continuously mounted in `#main-content-scroll`.
     - **Layer 1 (Catalog)**: The "All Projects" catalog view lives in an independent slide-over panel (`z-20`, `transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`).
     - **Layer 2 (Project Detail)**: The specific project detail case study view lives in an independent slide-over panel (`z-30`, `transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`).
     - Clicking a project from the catalog smoothly slides Layer 2 in from the right directly over Layer 1.
     - Clicking **"← Back to All Projects"** smoothly retracts Layer 2 to the right (`translate-x-full`), revealing the catalog view underneath with the user's search query, filter pills, and exact scroll position intact.
     - Clicking **"← Back to Overview"** on the catalog smoothly retracts Layer 1 to the right, returning to the overview canvas without any jumpscare.
  4. **Universal Smooth Slide-From-Right Page Transitions**:
     - Route transitions in [App.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/App.tsx) wrap pages using `useLocation()` with `animate-in slide-in-from-right-8 fade-in duration-300 ease-out`, so navigating between the public site, admin login, and the admin console glides in smoothly from the right.
     - Admin dashboard tabs in [AdminDashboard.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/features/admin/AdminDashboard.tsx) glide smoothly in from the right when switching between manager views.

---

## 5. Visitor Telemetry & Real-Time Analytics
- **Database Table (`VisitorActivity`)**:
  - `id`: Unique entry UUID
  - `sessionId`: Persistent browser identifier (`portfolio_visitor_session` stored in visitor `localStorage`)
  - `device`: Detected device (`Mobile` or `Desktop`)
  - `browser`: Detected browser (`Chrome`, `Firefox`, `Safari`, `Edge`, etc.)
  - `referrer`: Traffic source (e.g., `google.com`, `Direct`)
  - `path`: Active pathname
  - `durationSeconds`: Total time spent by this visitor session in seconds
  - `lastPingAt`: Timestamp of the latest heartbeat ping
- **Client Tracker Hook ([useVisitorTracker.ts](file:///home/sakil/Desktop/portfolio/frontend/src/lib/useVisitorTracker.ts))**:
  - Sends an initial ping on page mount.
  - While the page is active and visible (`document.visibilityState === 'visible'`), sends a heartbeat every 15 seconds to accumulate time spent accurately.
- **Admin Management Console ([AnalyticsManager.tsx](file:///home/sakil/Desktop/portfolio/frontend/src/features/admin/AnalyticsManager.tsx))**:
  - Overview cards: **Total Sessions**, **Total Time Spent**, and **Average Time per Visitor**.
  - Interactive table displaying visitor timestamps, devices, browsers, and durations.
  - **Bulk Selection & Deletion**: Select individual logs or click "Select All" to delete chosen activity logs from the database, or clear all records.

---

## 6. Curated Light Theme ("Parchment Studio")
- Designed specifically to prevent eye fatigue by replacing raw white glare with warm concrete slate tones:
  - `--color-bg`: `#e2e8f0` (warm slate canvas)
  - `--color-surface`: `#f1f5f9` (soft elevated concrete)
  - `--color-border`: `#cbd5e1` (graphite borders)
  - `--color-text`: `#0f172a` (deep ink black)
  - `--color-text-muted`: `#475569` (charcoal subtext)
  - `--color-accent`: `#0284c7` (ocean tech blue)

---

## 7. Boxy Developer Aesthetics
- Replaced large pill radiuses (`rounded-2xl`, `rounded-full`) with crisp `rounded-lg` and `rounded-md` across all cards, pills, avatar boxes, input fields, and action buttons.

---

## 8. Profile Photo Management with Male Coder SVG Fallback
- **Admin Management**: Under `/admin/dashboard` -> **Bio, Skills, Education & Fonts**, admins can upload a headshot photo directly to Cloudinary or click **"Delete Photo & Use SVG"**.
- **Automatic Fallback**: If `profile.avatarUrl` is null/empty or deleted, the desktop sidebar, mobile header, and mobile drawer immediately render the handcrafted vector [`MaleCoderAvatar.tsx`](file:///home/sakil/Desktop/portfolio/frontend/src/components/ui/MaleCoderAvatar.tsx).

---

## 9. Project Screenshots (Gallery) Management
- **Admin Management**: Under `/admin/dashboard` -> **Project Management**, admins can upload multiple screenshots to `galleryUrls`.
- Each uploaded screenshot appears as a preview thumbnail with a quick delete button (`× Delete`).
- Rendered in the case study view ([`ProjectDetailView.tsx`](file:///home/sakil/Desktop/portfolio/frontend/src/features/projects/ProjectDetailView.tsx)) under `// SYSTEM_SCREENSHOTS`.

---

## 10. Technical Skill Icon Integration
- **Admin Management**: Under `/admin/dashboard` -> **Bio, Skills, Education & Fonts**, skills now feature an icon field (supporting direct image upload or Lucide icon names).
- Public display in [`SkillsSection.tsx`](file:///home/sakil/Desktop/portfolio/frontend/src/features/profile/SkillsSection.tsx) automatically renders Cloudinary images, Lucide icons, or falls back to the clean `<Terminal />` glyph.

---

## 11. 4–5 Second Developer Barcode Boot Screen
- Component: [`DeveloperBootScreen.tsx`](file:///home/sakil/Desktop/portfolio/frontend/src/components/ui/DeveloperBootScreen.tsx).
- Runs **on every refresh** to provide a consistent high-tech terminal boot loading experience:
  - Animated laser scanner running along the barcode pattern strip.
  - Hex memory address counters and dynamic ASCII progress gauge (`[===========> ] 87%`).
  - Terminal kernel log stream (`BIOS_POST`, `INIT_KERNEL`, `THEME_SUBSYSTEM`, `DEVICE`).
  - Smooth fade-out and scale transition upon completion, revealing the portfolio seamlessly.

---

## 12. Unified Master Viewport Frame & Universal Scrollbars
- **Unified Master Frame**: The entire public desktop view is framed by a single perimeter border container:
  - Container dimensions: `w-[95%] max-w-[1700px] h-[calc(100vh-2rem)] rounded-xl border border-border bg-surface/30 backdrop-blur-md overflow-hidden`.
  - The docked sidebar sits inside on the left with an internal dividing `border-r border-border`.
  - The main section sits on the right inside this exact frame with its own smooth internal scroll container (`#main-content-scroll`).
  - **Zero Outer Scroll**: The outer window is strictly locked to `h-screen overflow-hidden`, eliminating any unwanted extra vertical page scroll.
- **Universal Scrollbars**: Updated [`globals.css`](file:///home/sakil/Desktop/portfolio/frontend/src/styles/globals.css) with `scrollbar-width: thin` and styled `::-webkit-scrollbar-thumb`, ensuring all nested scrollbars in the public site and admin panel (skills, experiences, education, analytics) are visible and smoothly scrollable.

---

## 13. Social Links & External Profiles Manager
- Database Model: `SocialLink` (`title`, `icon`, `link`, `showOnHero`, `showOnFooter`, `order`).
- Backend Routes: `/api/socials` with full GET, POST, PUT, DELETE endpoints protected by admin authentication.
- **Admin Panel Management**: Added the dedicated tab **"Social & External Links"** ([`SocialsManager.tsx`](file:///home/sakil/Desktop/portfolio/frontend/src/features/admin/SocialsManager.tsx)).
  - Admins can create, edit, delete, and reorder links for GitHub, LinkedIn, Twitter, Upwork, YouTube, and custom websites.
  - Toggle visibility for **Hero / About** and **Footer**.
  - Icon picker with live icon preview and quick-select chips.
