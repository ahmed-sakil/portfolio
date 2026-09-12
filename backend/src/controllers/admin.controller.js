import { prisma } from '../index.js';
import { sortItemsBySlot } from '../utils/sortHelper.js';

// PROFILE
export const updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id; // Prevent Prisma from attempting to update the primary key
    
    // Clean up "null" strings that come from FormData
    for (const key in data) {
      if (data[key] === 'null' || data[key] === '') {
        data[key] = null;
      }
    }
    
    // Convert date if present and valid
    if (data.career_start_date) {
      data.career_start_date = new Date(data.career_start_date);
    }

    // Convert years_of_experience if present
    if (data.years_of_experience !== undefined && data.years_of_experience !== null && data.years_of_experience !== '') {
      data.years_of_experience = parseInt(data.years_of_experience, 10);
      if (isNaN(data.years_of_experience)) data.years_of_experience = null;
    }
    let profile = null;
    try {
      profile = await prisma.profile.findFirst();
    } catch (e) {
      console.warn("Could not find profile with default prisma client:", e.message);
      try {
        const raw = await prisma.$queryRaw`SELECT * FROM "Profile" LIMIT 1`;
        profile = raw && raw.length > 0 ? raw[0] : null;
      } catch (rawErr) {
        profile = null;
      }
    }
    if (req.files) {
      if (req.files['hero_image']) {
        data.hero_image_url = req.files['hero_image'][0].path;
      }
      if (req.files['icon_image']) {
        data.icon_image_url = req.files['icon_image'][0].path;
      }
      if (req.files['journey_image']) {
        data.journey_image_url = req.files['journey_image'][0].path;
      }
      if (req.files['favicon_image']) {
        data.favicon_url = req.files['favicon_image'][0].path;
      }
      if (req.files['profile_image']) {
        data.profile_image_url = req.files['profile_image'][0].path;
      }
    }

    try {
      if (!profile) {
        profile = await prisma.profile.create({ data });
      } else {
        profile = await prisma.profile.update({
          where: { id: profile.id },
          data
        });
      }
    } catch (prismaErr) {
      console.warn("Primary profile update failed (columns may need migration), attempting fallback:", prismaErr.message);
      // Strip fields that might not be migrated yet in postgres
      const fallbackData = { ...data };
      delete fallbackData.full_name;
      delete fallbackData.role;
      delete fallbackData.years_of_experience;
      delete fallbackData.resume_drive_link;
      delete fallbackData.hero_image_url;
      delete fallbackData.icon_image_url;
      delete fallbackData.journey_image_url;
      delete fallbackData.connect_message;
      if (!profile) {
        profile = await prisma.profile.create({ data: fallbackData });
      } else {
        profile = await prisma.profile.update({
          where: { id: profile.id },
          data: fallbackData
        });
      }
    }
    res.json(profile);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: 'Error updating profile', error: error.message || error });
  }
};

// SKILLS
export const createSkill = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      category: req.body.category,
      percentage: parseInt(req.body.percentage, 10) || 0,
      icon_name: req.body.icon_name ? req.body.icon_name.trim() : null,
      icon_url: req.body.icon_url ? req.body.icon_url.trim() : null,
      icon_type: req.body.icon_type || 'light'
    };
    const skill = await prisma.skill.create({ data });
    res.json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: error.message || 'Error creating skill' });
  }
};
export const updateSkill = async (req, res) => {
  try {
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.category !== undefined) data.category = req.body.category;
    if (req.body.percentage !== undefined) data.percentage = parseInt(req.body.percentage, 10) || 0;
    if (req.body.icon_name !== undefined) {
      data.icon_name = req.body.icon_name ? req.body.icon_name.trim() : null;
    }
    if (req.body.icon_url !== undefined) {
      data.icon_url = req.body.icon_url ? req.body.icon_url.trim() : null;
    }
    if (req.body.icon_type !== undefined) {
      data.icon_type = req.body.icon_type || 'light';
    }
    const skill = await prisma.skill.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(skill);
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: error.message || 'Error updating skill' });
  }
};
export const deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: error.message || 'Error deleting skill' });
  }
};

// PROJECTS
export const getAdminProjects = async (req, res) => {
  try {
    let projects = [];
    try {
      projects = await prisma.project.findMany();
    } catch {
      projects = [];
    }
    const sorted = sortItemsBySlot(projects);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image_url = req.file.path;
    if (typeof data.tech_stack === 'string') data.tech_stack = JSON.parse(data.tech_stack);
    if (data.is_featured !== undefined) {
      data.is_featured = data.is_featured === 'true' || data.is_featured === true;
    }
    if (data.priority !== undefined) {
      data.priority = parseInt(data.priority, 10) || 0;
    }
    
    const project = await prisma.project.create({ data });
    res.json(project);
  } catch (error) { res.status(500).json({ error }); }
};
export const updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    if (req.file) data.image_url = req.file.path;
    if (typeof data.tech_stack === 'string') data.tech_stack = JSON.parse(data.tech_stack);
    if (data.is_featured !== undefined) {
      data.is_featured = data.is_featured === 'true' || data.is_featured === true;
    }
    if (data.priority !== undefined) {
      data.priority = parseInt(data.priority, 10) || 0;
    }
    
    const project = await prisma.project.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(project);
  } catch (error) { res.status(500).json({ error }); }
};
export const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error }); }
};

// EXPERIENCES
export const createExperience = async (req, res) => {
  try {
    const raw = { ...req.body };
    delete raw.id;

    const data = {
      type: raw.type || 'EXPERIENCE',
      title: raw.title || 'Untitled',
      company: raw.company || '',
      institution_url: raw.institution_url?.trim() || null,
      image_url: req.file ? req.file.path : (raw.image_url?.trim() || null),
      description: raw.description?.trim() || null,
      result: raw.result?.trim() || null,
      start_date: raw.start_date ? new Date(raw.start_date) : new Date(),
      is_current: raw.is_current === 'true' || raw.is_current === true,
      end_date: (raw.is_current === 'true' || raw.is_current === true || !raw.end_date || raw.end_date === 'null')
        ? null
        : new Date(raw.end_date)
    };

    const experience = await prisma.experience.create({ data });
    res.json(experience);
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ message: error.message || 'Failed to create experience entry' });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const raw = { ...req.body };
    delete raw.id;

    const isCurrent = raw.is_current === 'true' || raw.is_current === true;

    const data = {
      is_current: isCurrent,
    };

    if (raw.type !== undefined) data.type = raw.type;
    if (raw.title !== undefined) data.title = raw.title;
    if (raw.company !== undefined) data.company = raw.company;
    if (raw.institution_url !== undefined) data.institution_url = raw.institution_url ? raw.institution_url.trim() : null;
    if (req.file) {
      data.image_url = req.file.path;
    } else if (raw.image_url !== undefined) {
      data.image_url = raw.image_url ? raw.image_url.trim() : null;
    }
    if (raw.description !== undefined) data.description = raw.description ? raw.description.trim() : null;
    if (raw.result !== undefined) data.result = raw.result ? raw.result.trim() : null;
    if (raw.start_date) data.start_date = new Date(raw.start_date);
    if (isCurrent || !raw.end_date || raw.end_date === 'null' || raw.end_date === '') {
      data.end_date = null;
    } else {
      data.end_date = new Date(raw.end_date);
    }

    const experience = await prisma.experience.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(experience);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ message: error.message || 'Failed to update experience entry' });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: error.message || 'Error deleting experience' });
  }
};

// BLOGS
export const getAdminBlogs = async (req, res) => {
  try {
    let blogs = [];
    try {
      blogs = await prisma.blog.findMany();
    } catch {
      blogs = [];
    }
    const sorted = sortItemsBySlot(blogs);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to load blogs' });
  }
};

export const createBlog = async (req, res) => {
  try {
    const raw = { ...req.body };
    delete raw.id;

    // Clean or generate slug
    let slug = (raw.slug || raw.title || 'post')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) slug = `post-${Date.now()}`;

    // Prevent duplicate slug constraint crash
    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const data = {
      title: raw.title || 'Untitled Post',
      slug,
      content: raw.content || '',
      excerpt: raw.excerpt ? raw.excerpt.trim() : null,
      cover_image_url: req.file ? req.file.path : (raw.cover_image_url || null),
      published_at: raw.published_at ? new Date(raw.published_at) : new Date(),
      is_published: raw.is_published === undefined ? true : (raw.is_published === 'true' || raw.is_published === true),
      is_featured: raw.is_featured === undefined ? true : (raw.is_featured === 'true' || raw.is_featured === true),
      priority: parseInt(raw.priority, 10) || 0,
    };

    const blog = await prisma.blog.create({ data });
    res.json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: error.message || 'Failed to create blog post' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const raw = { ...req.body };
    delete raw.id;

    const data = {};
    if (raw.title !== undefined) data.title = raw.title;
    if (raw.slug !== undefined) {
      data.slug = raw.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (raw.content !== undefined) data.content = raw.content;
    if (raw.excerpt !== undefined) data.excerpt = raw.excerpt ? raw.excerpt.trim() : null;
    if (req.file) {
      data.cover_image_url = req.file.path;
    } else if (raw.cover_image_url !== undefined) {
      data.cover_image_url = raw.cover_image_url || null;
    }
    if (raw.is_published !== undefined) {
      data.is_published = raw.is_published === 'true' || raw.is_published === true;
    }
    if (raw.is_featured !== undefined) {
      data.is_featured = raw.is_featured === 'true' || raw.is_featured === true;
    }
    if (raw.priority !== undefined) {
      data.priority = parseInt(raw.priority, 10) || 0;
    }

    const blog = await prisma.blog.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: error.message || 'Failed to update blog post' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete blog post' });
  }
};

// MESSAGES
export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { created_at: 'desc' } });
    res.json(messages);
  } catch (error) {
    console.warn("getMessages primary query failed, attempting raw fallback:", error.message);
    try {
      const messages = await prisma.$queryRaw`SELECT * FROM "ContactMessage" ORDER BY created_at DESC`;
      res.json(messages || []);
    } catch (rawErr) {
      res.status(500).json({ error: error.message });
    }
  }
};
export const markMessageRead = async (req, res) => {
  try {
    await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { is_read: true }
    });
    res.json({ message: 'Marked as read' });
  } catch (error) { res.status(500).json({ error }); }
};

// SERVICES
export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json(services || []);
  } catch (error) {
    console.warn('getServices notice (run `npx prisma db push`):', error.message);
    res.json([]);
  }
};
export const createService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    const service = await prisma.service.create({ data });
    res.json(service);
  } catch (error) {
    console.error('createService error:', error);
    res.status(500).json({ message: 'Error creating service. Please ensure your database is running and run `npx prisma db push`.', error: error.message });
  }
};
export const updateService = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    const service = await prisma.service.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(service);
  } catch (error) {
    console.error('updateService error:', error);
    res.status(500).json({ message: 'Error updating service.', error: error.message });
  }
};
export const deleteService = async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteService error:', error);
    res.status(500).json({ message: 'Error deleting service.', error: error.message });
  }
};

// SOCIAL LINKS
export const getSocialLinks = async (req, res) => {
  try {
    let links = [];
    try {
      links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } });
    } catch {
      links = await prisma.socialLink.findMany();
    }
    res.json(links || []);
  } catch (error) {
    console.warn('getSocialLinks notice:', error.message);
    res.json([]);
  }
};
export const createSocialLink = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    if (data.show_in_hero !== undefined) data.show_in_hero = data.show_in_hero === 'true' || data.show_in_hero === true;
    if (data.show_in_footer !== undefined) data.show_in_footer = data.show_in_footer === 'true' || data.show_in_footer === true;
    if (data.icon_name !== undefined) data.icon_name = data.icon_name ? data.icon_name.trim() : null;
    if (data.icon_url !== undefined) data.icon_url = data.icon_url ? data.icon_url.trim() : null;
    if (data.icon_type !== undefined) data.icon_type = data.icon_type || 'light';
    try {
      const link = await prisma.socialLink.create({ data });
      return res.json(link);
    } catch (createErr) {
      console.warn("createSocialLink fallback:", createErr.message);
      const fallbackData = { 
        platform: data.platform, 
        url: data.url, 
        icon_name: data.icon_name,
        icon_url: data.icon_url,
        icon_type: data.icon_type || 'light'
      };
      const link = await prisma.socialLink.create({ data: fallbackData });
      return res.json(link);
    }
  } catch (error) {
    console.error('createSocialLink error:', error);
    res.status(500).json({ message: 'Error creating social link.', error: error.message });
  }
};
export const updateSocialLink = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    if (data.order !== undefined) data.order = parseInt(data.order, 10) || 0;
    if (data.show_in_hero !== undefined) data.show_in_hero = data.show_in_hero === 'true' || data.show_in_hero === true;
    if (data.show_in_footer !== undefined) data.show_in_footer = data.show_in_footer === 'true' || data.show_in_footer === true;
    if (data.icon_name !== undefined) data.icon_name = data.icon_name ? data.icon_name.trim() : null;
    if (data.icon_url !== undefined) data.icon_url = data.icon_url ? data.icon_url.trim() : null;
    if (data.icon_type !== undefined) data.icon_type = data.icon_type || 'light';
    try {
      const link = await prisma.socialLink.update({ where: { id: parseInt(req.params.id) }, data });
      return res.json(link);
    } catch (updateErr) {
      console.warn("updateSocialLink fallback:", updateErr.message);
      const fallbackData = { 
        platform: data.platform, 
        url: data.url, 
        icon_name: data.icon_name,
        icon_url: data.icon_url,
        icon_type: data.icon_type || 'light'
      };
      const link = await prisma.socialLink.update({ where: { id: parseInt(req.params.id) }, data: fallbackData });
      return res.json(link);
    }
  } catch (error) {
    console.error('updateSocialLink error:', error);
    res.status(500).json({ message: 'Error updating social link.', error: error.message });
  }
};
export const deleteSocialLink = async (req, res) => {
  try {
    await prisma.socialLink.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteSocialLink error:', error);
    res.status(500).json({ message: 'Error deleting social link.', error: error.message });
  }
};

// THEMES
export const getThemes = async (req, res) => {
  try {
    const themes = await prisma.theme.findMany({ orderBy: { created_at: 'asc' } });
    res.json(themes || []);
  } catch (error) {
    console.warn('getThemes notice (run `npx prisma db push`):', error.message);
    res.json([]);
  }
};
export const createTheme = async (req, res) => {
  try {
    const data = { ...req.body };
    data.is_active = data.is_active === true || data.is_active === 'true';
    if (data.is_active) {
      await prisma.theme.updateMany({ data: { is_active: false } });
    }
    const theme = await prisma.theme.create({ data });
    res.json(theme);
  } catch (error) {
    console.error('createTheme error:', error);
    res.status(500).json({ message: 'Error creating theme. Please run `npx prisma db push`.', error: error.message });
  }
};
export const updateTheme = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    if (data.is_active !== undefined) {
      data.is_active = data.is_active === true || data.is_active === 'true';
      if (data.is_active) {
        await prisma.theme.updateMany({ data: { is_active: false } });
      }
    }
    const theme = await prisma.theme.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(theme);
  } catch (error) {
    console.error('updateTheme error:', error);
    res.status(500).json({ message: 'Error updating theme.', error: error.message });
  }
};
export const deleteTheme = async (req, res) => {
  try {
    await prisma.theme.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteTheme error:', error);
    res.status(500).json({ message: 'Error deleting theme.', error: error.message });
  }
};
export const activateTheme = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.theme.updateMany({ data: { is_active: false } });
    const theme = await prisma.theme.update({
      where: { id },
      data: { is_active: true }
    });
    res.json(theme);
  } catch (error) {
    console.error('activateTheme error:', error);
    res.status(500).json({ message: 'Error activating theme.', error: error.message });
  }
};

// CUSTOM ICONS LIBRARY
export const getCustomIcons = async (req, res) => {
  try {
    let icons = [];
    try {
      icons = await prisma.customIcon.findMany({ orderBy: { created_at: 'desc' } });
    } catch (err) {
      console.warn('CustomIcon query fallback:', err.message);
      icons = await prisma.$queryRaw`SELECT * FROM "CustomIcon" ORDER BY created_at DESC`;
    }
    res.json(icons || []);
  } catch (error) {
    console.error('getCustomIcons error:', error);
    res.status(500).json({ message: error.message || 'Failed to load custom icons' });
  }
};

export const createCustomIcon = async (req, res) => {
  try {
    const raw = { ...req.body };
    const url = req.file ? req.file.path : (raw.url?.trim() || null);
    if (!url) {
      return res.status(400).json({ message: 'Icon image file or URL is required' });
    }
    const name = raw.name?.trim() || 'Custom Icon';
    const icon_type = raw.icon_type || 'light';

    const customIcon = await prisma.customIcon.create({
      data: {
        name,
        url,
        icon_type
      }
    });
    res.json(customIcon);
  } catch (error) {
    console.error('createCustomIcon error:', error);
    res.status(500).json({ message: error.message || 'Failed to create custom icon' });
  }
};

export const deleteCustomIcon = async (req, res) => {
  try {
    await prisma.customIcon.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('deleteCustomIcon error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete custom icon' });
  }
};
