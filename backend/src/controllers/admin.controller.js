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
    const skill = await prisma.skill.create({ data: { ...req.body, percentage: parseInt(req.body.percentage) } });
    res.json(skill);
  } catch (error) { res.status(500).json({ error }); }
};
export const updateSkill = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.percentage) data.percentage = parseInt(data.percentage);
    const skill = await prisma.skill.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(skill);
  } catch (error) { res.status(500).json({ error }); }
};
export const deleteSkill = async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error }); }
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
    const data = { ...req.body };
    data.start_date = new Date(data.start_date);
    if (data.end_date) data.end_date = new Date(data.end_date);
    data.is_current = data.is_current === 'true' || data.is_current === true;

    const experience = await prisma.experience.create({ data });
    res.json(experience);
  } catch (error) { res.status(500).json({ error }); }
};
export const updateExperience = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;

    // Convert boolean string from FormData
    data.is_current = data.is_current === 'true' || data.is_current === true;

    // Parse dates, but null out empty strings
    data.start_date = data.start_date ? new Date(data.start_date) : undefined;
    // If currently working there, end_date must be null not an empty string
    if (!data.end_date || data.end_date === '' || data.end_date === 'null') {
      data.end_date = null;
    } else {
      data.end_date = new Date(data.end_date);
    }

    // Clean up other null strings
    for (const key in data) {
      if (data[key] === 'null' || data[key] === '') {
        data[key] = null;
      }
    }

    console.log('Updating experience with data:', data);
    const experience = await prisma.experience.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(experience);
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: error.message });
  }
};
export const deleteExperience = async (req, res) => {
  try {
    await prisma.experience.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error }); }
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
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.cover_image_url = req.file.path;
    if (data.is_featured !== undefined) {
      data.is_featured = data.is_featured === 'true' || data.is_featured === true;
    }
    if (data.priority !== undefined) {
      data.priority = parseInt(data.priority, 10) || 0;
    }
    const blog = await prisma.blog.create({ data });
    res.json(blog);
  } catch (error) { res.status(500).json({ error }); }
};
export const updateBlog = async (req, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    if (req.file) data.cover_image_url = req.file.path;
    if (data.is_featured !== undefined) {
      data.is_featured = data.is_featured === 'true' || data.is_featured === true;
    }
    if (data.priority !== undefined) {
      data.priority = parseInt(data.priority, 10) || 0;
    }
    const blog = await prisma.blog.update({ where: { id: parseInt(req.params.id) }, data });
    res.json(blog);
  } catch (error) { res.status(500).json({ error }); }
};
export const deleteBlog = async (req, res) => {
  try {
    await prisma.blog.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error }); }
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
    try {
      const link = await prisma.socialLink.create({ data });
      return res.json(link);
    } catch (createErr) {
      console.warn("createSocialLink fallback without 'order':", createErr.message);
      const fallbackData = { platform: data.platform, url: data.url, icon_name: data.icon_name };
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
    try {
      const link = await prisma.socialLink.update({ where: { id: parseInt(req.params.id) }, data });
      return res.json(link);
    } catch (updateErr) {
      console.warn("updateSocialLink fallback without 'order':", updateErr.message);
      const fallbackData = { platform: data.platform, url: data.url, icon_name: data.icon_name };
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
