import { prisma } from '../index.js';
import { sortItemsBySlot } from '../utils/sortHelper.js';

export const getPortfolio = async (req, res) => {
  try {
    let profile = null;
    try {
      profile = await prisma.profile.findFirst();
    } catch (err) {
      console.warn('Profile query notice, attempting raw fallback:', err.message);
      try {
        const raw = await prisma.$queryRaw`SELECT * FROM "Profile" LIMIT 1`;
        profile = raw && raw.length > 0 ? raw[0] : null;
      } catch {
        profile = null;
      }
    }

    const skills = await prisma.skill.findMany().catch(err => {
      console.warn('Skills query notice:', err.message);
      return [];
    });

    const experiences = await prisma.experience.findMany({ orderBy: { start_date: 'desc' } }).catch(err => {
      console.warn('Experience query notice:', err.message);
      return [];
    });

    let rawProjects = [];
    try {
      rawProjects = await prisma.project.findMany();
    } catch (err) {
      console.warn('Project query notice:', err.message);
    }
    const allProjects = sortItemsBySlot(rawProjects);
    const projects = allProjects.filter((p) => p.is_featured !== false);

    let rawBlogs = [];
    try {
      rawBlogs = await prisma.blog.findMany();
    } catch (err) {
      console.warn('Blog query notice:', err.message);
    }
    const allBlogs = sortItemsBySlot(rawBlogs);
    const blogs = allBlogs.filter((b) => b.is_featured !== false);

    // Support both older schema without 'order' column and newer schema
    let socialLinks = [];
    try {
      socialLinks = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    } catch {
      try {
        socialLinks = await prisma.socialLink.findMany();
      } catch (err) {
        console.warn('SocialLink query notice:', err.message);
      }
    }

    // Gracefully handle Service and Theme if database has not yet been migrated
    let services = [];
    try {
      services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    } catch (err) {
      console.warn('Services table notice (run prisma db push to apply new table):', err.message);
    }

    let activeTheme = null;
    try {
      activeTheme = await prisma.theme.findFirst({ where: { is_active: true } });
    } catch (err) {
      console.warn('Theme table notice (run prisma db push to apply new table):', err.message);
    }

    res.json({
      profile: profile || {
        full_name: 'Sakil Ahmed',
        role: 'Full Stack Developer',
        title: 'Full Stack Developer',
        bio: 'Building scalable, modern and performant web applications.',
        connect_message: 'Currently open to freelance opportunities and full-time senior roles.',
        journey_image_url: '/assets/glowing_programmer.jpg'
      },
      skills: skills || [],
      experiences: experiences || [],
      projects: projects || [],
      blogs: blogs || [],
      allProjects: allProjects || [],
      allBlogs: allBlogs || [],
      socialLinks: socialLinks || [],
      services: services || [],
      activeTheme
    });
  } catch (error) {
    console.error('getPortfolio error:', error);
    res.status(500).json({ 
      message: 'Server error fetching portfolio data',
      error: error.message 
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    let raw = [];
    try {
      raw = await prisma.project.findMany();
    } catch {
      raw = [];
    }
    const projects = sortItemsBySlot(raw);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    let raw = [];
    try {
      raw = await prisma.blog.findMany();
    } catch {
      raw = [];
    }
    const blogs = sortItemsBySlot(raw);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

export const submitContact = async (req, res) => {
  const { name, email, subject, message, reason, company } = req.body;
  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || reason || 'Portfolio Inquiry',
        message,
        reason: reason || null,
        company: company || null,
      }
    });
    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.warn('Primary submitContact error, attempting fallback without new columns:', error.message);
    try {
      const combinedMessage = [
        reason ? `[Category / Reason: ${reason}]` : null,
        company ? `[Company / Organization: ${company}]` : null,
        '',
        message
      ].filter(Boolean).join('\n');

      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject: subject || reason || 'Portfolio Inquiry',
          message: combinedMessage
        }
      });
      res.json({ message: 'Message sent successfully!' });
    } catch (fallbackErr) {
      console.error('submitContact fallback error:', fallbackErr);
      res.status(500).json({ message: 'Failed to send message', error: fallbackErr.message });
    }
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: req.params.slug } });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching blog', error: error.message });
  }
};
