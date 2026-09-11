import { Router } from 'express';
import { login, changeCredentials, getAdminCredentials } from '../controllers/auth.controller.js';
import { getPortfolio, submitContact, getBlogBySlug, getAllProjects, getAllBlogs } from '../controllers/public.controller.js';
import { getStats } from '../controllers/stats.controller.js';
import { 
  updateProfile, 
  createSkill, updateSkill, deleteSkill, 
  getAdminProjects, createProject, updateProject, deleteProject, 
  createExperience, updateExperience, deleteExperience, 
  getAdminBlogs, createBlog, updateBlog, deleteBlog, 
  getMessages, markMessageRead,
  getServices, createService, updateService, deleteService,
  getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
  getThemes, createTheme, updateTheme, deleteTheme, activateTheme
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = Router();

// --- PUBLIC ROUTES ---
router.post('/auth/login', login);
router.get('/portfolio', getPortfolio);
router.get('/projects', getAllProjects);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:slug', getBlogBySlug);
router.post('/contact', submitContact);
router.get('/stats', getStats);

// --- PROTECTED ADMIN ROUTES ---
router.use('/admin', authMiddleware);

// Profile
router.put('/admin/profile', upload.fields([
  { name: 'hero_image', maxCount: 1 },
  { name: 'icon_image', maxCount: 1 },
  { name: 'journey_image', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 },
  { name: 'favicon_image', maxCount: 1 }
]), updateProfile);

// Skills
router.post('/admin/skills', createSkill);
router.put('/admin/skills/:id', updateSkill);
router.delete('/admin/skills/:id', deleteSkill);

// Projects
router.get('/admin/projects', getAdminProjects);
router.post('/admin/projects', upload.single('image'), createProject);
router.put('/admin/projects/:id', upload.single('image'), updateProject);
router.delete('/admin/projects/:id', deleteProject);

// Experiences & Education
router.post('/admin/experiences', createExperience);
router.put('/admin/experiences/:id', updateExperience);
router.delete('/admin/experiences/:id', deleteExperience);

// Blogs
router.get('/admin/blogs', getAdminBlogs);
router.post('/admin/blogs', upload.single('cover_image'), createBlog);
router.put('/admin/blogs/:id', upload.single('cover_image'), updateBlog);
router.delete('/admin/blogs/:id', deleteBlog);

// Messages
router.get('/admin/messages', getMessages);
router.patch('/admin/messages/:id/read', markMessageRead);

// Services
router.get('/admin/services', getServices);
router.post('/admin/services', createService);
router.put('/admin/services/:id', updateService);
router.delete('/admin/services/:id', deleteService);

// Social Links
router.get('/admin/social-links', getSocialLinks);
router.post('/admin/social-links', createSocialLink);
router.put('/admin/social-links/:id', updateSocialLink);
router.delete('/admin/social-links/:id', deleteSocialLink);

// Themes
router.get('/admin/themes', getThemes);
router.post('/admin/themes', createTheme);
router.put('/admin/themes/:id', updateTheme);
router.delete('/admin/themes/:id', deleteTheme);
router.patch('/admin/themes/:id/activate', activateTheme);

// Security & Account Credentials
router.get('/admin/credentials', getAdminCredentials);
router.put('/admin/credentials', changeCredentials);

export default router;
