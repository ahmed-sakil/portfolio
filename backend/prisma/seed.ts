import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio database...');

  // 1. Seed Admin User
  const defaultAdminEmail = 'admin@portfolio.local';
  const defaultPassword = 'adminpassword123';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: defaultAdminEmail },
    update: {},
    create: {
      email: defaultAdminEmail,
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Seed Curated Minimalist Themes with Reworked Warm Slate Light Theme
  const themes = [
    {
      name: 'Obsidian Minimal',
      slug: 'obsidian-minimal',
      bg: '#09090b',
      surface: '#121215',
      border: '#27272a',
      text: '#fafafa',
      textMuted: '#a1a1aa',
      accent: '#ffffff',
      isDefault: true,
    },
    {
      name: 'Midnight Emerald',
      slug: 'midnight-emerald',
      bg: '#080c0a',
      surface: '#0f1712',
      border: '#1b2d22',
      text: '#f2fbf5',
      textMuted: '#7ca88c',
      accent: '#10b981',
      isDefault: false,
    },
    {
      name: 'Nordic Slate',
      slug: 'nordic-slate',
      bg: '#0b1120',
      surface: '#131d33',
      border: '#233354',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      accent: '#38bdf8',
      isDefault: false,
    },
    {
      name: 'Monokai Charcoal',
      slug: 'monokai-charcoal',
      bg: '#141416',
      surface: '#1e1e24',
      border: '#2e2e38',
      text: '#f5f5f7',
      textMuted: '#a3a3b2',
      accent: '#f59e0b',
      isDefault: false,
    },
    {
      name: 'Parchment Studio',
      slug: 'parchment-studio',
      bg: '#e2e8f0',       // Muted warm slate/paper grey (no harsh glaring white!)
      surface: '#f1f5f9',  // Elevated soft concrete container
      border: '#cbd5e1',   // Crisp graphite borders
      text: '#0f172a',     // Deep ink black
      textMuted: '#475569',// Charcoal subtext
      accent: '#0284c7',   // Ocean tech blue
      isDefault: false,
    },
  ];

  for (const t of themes) {
    await prisma.theme.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  console.log('Seeded curated themes including reworked Parchment Studio');

  // 3. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: 'Sakil Ahmed',
        title: 'Full Stack Software Engineer',
        bio: 'Crafting scalable web applications, robust backend architectures, and high-performance digital experiences with modern web technologies.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        nationality: 'Bangladeshi',
        experienceYears: '5+ years',
        languages: 'English, Bengali, Hindi',
        resumeUrl: 'https://drive.google.com',
      },
    });
    console.log('Profile seeded');
  }

  // 4. Seed Social Links
  const socials = [
    { title: 'GitHub', icon: 'Github', link: 'https://github.com', showOnHero: true, showOnFooter: true, order: 1 },
    { title: 'LinkedIn', icon: 'Linkedin', link: 'https://linkedin.com', showOnHero: true, showOnFooter: true, order: 2 },
    { title: 'Resume', icon: 'FileText', link: 'https://drive.google.com', showOnHero: true, showOnFooter: false, order: 3 },
  ];

  for (const s of socials) {
    await prisma.socialLink.create({ data: s });
  }
  console.log('Social links seeded');

  // 5. Seed Experiences
  const experiences = [
    {
      company: '6sense Technology',
      role: 'Full Stack Developer',
      location: 'Dhaka, Bangladesh',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: 'Building microservices, high-throughput APIs, and responsive dashboards.',
      order: 1,
    },
    {
      company: 'Herogram Tech',
      role: 'Senior Full Stack Engineer',
      location: 'Remote',
      startDate: '2021',
      endDate: '2023',
      current: false,
      description: 'Engineered web applications and managed cloud infrastructure.',
      order: 2,
    },
    {
      company: 'Upwork & Fiverr',
      role: 'Freelance Software Engineer',
      location: 'Global',
      startDate: '2019',
      endDate: '2021',
      current: false,
      description: 'Delivered 30+ client projects with high satisfaction scores.',
      order: 3,
    },
  ];

  for (const e of experiences) {
    await prisma.experience.create({ data: e });
  }
  console.log('Experiences seeded');

  // 6. Seed Education (NEW)
  const educations = [
    {
      institution: 'University of Engineering & Technology',
      degree: 'B.Sc. in Computer Science & Engineering',
      field: 'Computer Systems, Algorithms & Networks',
      startDate: '2017',
      endDate: '2021',
      current: false,
      grade: 'First Class Honors',
      location: 'Dhaka, Bangladesh',
      description: 'Focused on distributed systems, database internals, and software engineering methodologies.',
      order: 1,
    },
    {
      institution: 'National Model Science College',
      degree: 'Higher Secondary Certificate (HSC)',
      field: 'Science & Mathematics',
      startDate: '2015',
      endDate: '2017',
      current: false,
      grade: 'GPA 5.00 / 5.00',
      location: 'Dhaka, Bangladesh',
      description: 'Concentrations in Physics, Higher Mathematics, and Information Technology.',
      order: 2,
    },
  ];

  for (const edu of educations) {
    await prisma.education.create({ data: edu });
  }
  console.log('Educations seeded');

  // 7. Seed Skills
  const skills = [
    { name: 'TypeScript', category: 'Programming Languages', order: 1 },
    { name: 'JavaScript', category: 'Programming Languages', order: 2 },
    { name: 'Go', category: 'Programming Languages', order: 3 },
    { name: 'Python', category: 'Programming Languages', order: 4 },
    { name: 'HTML5 & CSS3', category: 'Programming Languages', order: 5 },
    { name: 'React', category: 'Frameworks & Libraries', order: 6 },
    { name: 'Node.js', category: 'Frameworks & Libraries', order: 7 },
    { name: 'Express.js', category: 'Frameworks & Libraries', order: 8 },
    { name: 'Tailwind CSS', category: 'Frameworks & Libraries', order: 9 },
    { name: 'PostgreSQL', category: 'Databases & Tools', order: 10 },
    { name: 'Prisma ORM', category: 'Databases & Tools', order: 11 },
    { name: 'Docker', category: 'Databases & Tools', order: 12 },
    { name: 'Git & GitHub', category: 'Databases & Tools', order: 13 },
  ];

  for (const sk of skills) {
    await prisma.skill.create({ data: sk });
  }
  console.log('Skills seeded');

  // 8. Seed Projects
  const projects = [
    {
      title: 'HyperScale Cloud Console',
      slug: 'hyperscale-cloud-console',
      summary: 'Real-time multi-cluster telemetry and resource management dashboard.',
      descriptionMarkdown: 'An enterprise cloud console designed for monitoring distributed systems with sub-second WebSocket metric updates, automated cluster scaling, and zero-downtime deployment pipelines.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
      ],
      liveUrl: 'https://demo-example.com',
      githubUrl: 'https://github.com',
      tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      isFeatured: true,
      order: 1,
    },
    {
      title: 'NeonFlow Workflow Engine',
      slug: 'neonflow-workflow-engine',
      summary: 'Node-based event-driven workflow automation platform for engineering teams.',
      descriptionMarkdown: 'Visual DAG-based automation engine that allows teams to construct webhook listeners, conditional branches, and automated database sync tasks with zero code.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      ],
      liveUrl: 'https://demo-example.com',
      githubUrl: 'https://github.com',
      tags: ['TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
      isFeatured: true,
      order: 2,
    },
    {
      title: 'Aura Commerce Hub',
      slug: 'aura-commerce-hub',
      summary: 'High-speed headless commerce API & storefront with instant search.',
      descriptionMarkdown: 'Ultra-fast headless commerce application built with full-text search indexing, Stripe subscription integration, and lightning-fast edge caching.',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
      ],
      liveUrl: 'https://demo-example.com',
      githubUrl: 'https://github.com',
      tags: ['React', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      isFeatured: true,
      order: 3,
    },
    {
      title: 'Sentinels Security Scanner',
      slug: 'sentinels-security-scanner',
      summary: 'Static dependency vulnerability scanner with automated PR generation.',
      descriptionMarkdown: 'CLI and web platform to automatically audit npm & Go packages, compute vulnerability severity vectors, and open fix PRs.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      ],
      liveUrl: 'https://demo-example.com',
      githubUrl: 'https://github.com',
      tags: ['Go', 'TypeScript', 'Docker'],
      isFeatured: false,
      order: 4,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('Projects seeded');

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
