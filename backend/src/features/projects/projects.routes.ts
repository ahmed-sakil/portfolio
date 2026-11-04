import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().optional(),
  icon: z.string().optional().nullable(),
  summary: z.string().min(5),
  caseStudy: z.string().optional().nullable(),
  descriptionMarkdown: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  screenshots: z.array(z.string()).optional(),
  galleryUrls: z.array(z.string()).optional(),
  liveUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  level: z.string().optional(),
  projectType: z.string().optional(),
  isFeatured: z.boolean().optional(),
  featuredPriority: z.number().int().optional(),
  order: z.number().int().optional(),
  authorIds: z.array(z.string()).optional(),
});

// GET all projects (public with filters)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { featured, tag, category, level, projectType } = req.query;

    const where: any = {};
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (typeof tag === 'string' && tag.trim()) {
      where.tags = { has: tag.trim() };
    }
    if (typeof category === 'string' && category.trim() && category !== 'all') {
      where.category = category.trim();
    }
    if (typeof level === 'string' && level.trim() && level !== 'all') {
      where.level = level.trim();
    }
    if (typeof projectType === 'string' && projectType.trim() && projectType !== 'all') {
      where.projectType = projectType.trim();
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        authors: true,
      },
      orderBy: [
        { featuredPriority: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// GET single project by slug (public)
router.get('/by-slug/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        authors: true,
      },
    });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// POST new project (admin only)
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const screenshots = data.screenshots || data.galleryUrls || [];

    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category || 'Full Stack Web App',
        icon: data.icon || null,
        summary: data.summary,
        caseStudy: data.caseStudy || null,
        descriptionMarkdown: data.descriptionMarkdown || null,
        thumbnail: data.thumbnail || null,
        screenshots: screenshots,
        galleryUrls: screenshots,
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        tags: data.tags || [],
        level: data.level || 'Intermediate',
        projectType: data.projectType || 'Personal Project',
        isFeatured: data.isFeatured ?? false,
        featuredPriority: data.featuredPriority ?? 0,
        order: data.order ?? 0,
        authors: data.authorIds && data.authorIds.length > 0 ? {
          connect: data.authorIds.map((id) => ({ id })),
        } : undefined,
      },
      include: {
        authors: true,
      },
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create project' });
  }
});

// PUT update project (admin only)
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = projectSchema.partial().parse(req.body);
    const { authorIds, ...rest } = data;

    const updateData: any = { ...rest };
    if (data.screenshots) {
      updateData.galleryUrls = data.screenshots;
    }
    if (authorIds !== undefined) {
      updateData.authors = {
        set: authorIds.map((authorId) => ({ id: authorId })),
      };
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        authors: true,
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update project' });
  }
});

// DELETE project (admin only)
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export const projectRoutes = router;
