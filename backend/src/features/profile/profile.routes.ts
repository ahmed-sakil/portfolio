import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

// GET profile overview (Profile, Skills, Skill Categories, Experiences, Education, Specialized Services)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [profile, skills, rawCategories, experiences, educations, services] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
      prisma.skillCategory.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
      prisma.experience.findMany({ orderBy: [{ startDate: 'desc' }, { order: 'asc' }] }),
      prisma.education.findMany({ orderBy: [{ startDate: 'desc' }, { order: 'asc' }] }),
      prisma.specializedService.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    ]);

    let skillCategories = [...rawCategories];

    // Ensure all unique categories present in skills exist in skillCategories
    const existingCatNames = new Set(skillCategories.map((c) => c.name));
    const skillCatNames = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));

    const DEFAULT_CAT_ICONS: Record<string, string> = {
      'Programming Languages': 'Terminal',
      'Frameworks & Libraries': 'Atom',
      'Databases & Tools': 'Database',
      'Databases & Caching': 'Database',
      'Cloud & DevOps': 'Cloud',
    };

    const missingCats = skillCatNames.filter((cat) => !existingCatNames.has(cat));
    if (missingCats.length > 0) {
      let nextOrder = skillCategories.length;
      for (const missing of missingCats) {
        try {
          const created = await prisma.skillCategory.create({
            data: {
              name: missing,
              icon: DEFAULT_CAT_ICONS[missing] || 'FolderGit2',
              order: nextOrder++,
            },
          });
          skillCategories.push(created);
        } catch {
          // Ignore unique race condition
        }
      }
      skillCategories.sort((a, b) => a.order - b.order);
    }

    res.json({
      profile,
      skills,
      skillCategories,
      experiences,
      educations,
      services,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile overview' });
  }
});

// Profile Details PUT
const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string(),
  avatarUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  experienceYears: z.string().optional().nullable(),
  languages: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  availableForWork: z.boolean().optional(),
  heroImageUrl: z.string().optional().nullable(),
  heroTagline: z.string().optional().nullable(),
  expertiseItems: z.array(z.string()).optional(),
  fontFamily: z.string().optional().nullable(),
});

router.put('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = profileSchema.parse(req.body);
    const existing = await prisma.profile.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.profile.update({
        where: { id: existing.id },
        data,
      });
    } else {
      updated = await prisma.profile.create({ data });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update profile' });
  }
});

// SKILL CRUD
const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

router.post('/skills', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = skillSchema.parse(req.body);
    
    // Auto-create skill category if it doesn't exist
    const catExists = await prisma.skillCategory.findUnique({ where: { name: data.category.trim() } });
    if (!catExists) {
      const count = await prisma.skillCategory.count();
      await prisma.skillCategory.create({
        data: {
          name: data.category.trim(),
          icon: 'FolderGit2',
          order: count,
        },
      });
    }

    const skill = await prisma.skill.create({ data });
    res.status(201).json(skill);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to add skill' });
  }
});

router.put('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = skillSchema.partial().parse(req.body);

    if (data.category) {
      const catExists = await prisma.skillCategory.findUnique({ where: { name: data.category.trim() } });
      if (!catExists) {
        const count = await prisma.skillCategory.count();
        await prisma.skillCategory.create({
          data: {
            name: data.category.trim(),
            icon: 'FolderGit2',
            order: count,
          },
        });
      }
    }

    const updated = await prisma.skill.update({ where: { id }, data });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update skill' });
  }
});

router.delete('/skills/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.skill.delete({ where: { id } });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

// SKILL CATEGORY CRUD
const skillCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  icon: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

// POST new skill category
router.post('/skill-categories', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = skillCategorySchema.parse(req.body);
    const existing = await prisma.skillCategory.findUnique({ where: { name: data.name.trim() } });
    if (existing) {
      res.status(400).json({ message: 'A skill category with this name already exists' });
      return;
    }
    const cat = await prisma.skillCategory.create({
      data: {
        name: data.name.trim(),
        icon: data.icon || null,
        order: data.order ?? 0,
      },
    });
    res.status(201).json(cat);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create skill category' });
  }
});

// PUT update skill category (with cascading skill update if name changes)
router.put('/skill-categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = skillCategorySchema.partial().parse(req.body);

    const currentCat = await prisma.skillCategory.findUnique({ where: { id } });
    if (!currentCat) {
      res.status(404).json({ message: 'Skill category not found' });
      return;
    }

    const oldName = currentCat.name;
    const newName = data.name !== undefined ? data.name.trim() : oldName;

    if (newName !== oldName) {
      const duplicate = await prisma.skillCategory.findUnique({ where: { name: newName } });
      if (duplicate && duplicate.id !== id) {
        res.status(400).json({ message: 'A skill category with this name already exists' });
        return;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const category = await tx.skillCategory.update({
        where: { id },
        data: {
          name: newName,
          icon: data.icon !== undefined ? data.icon : currentCat.icon,
          order: data.order !== undefined ? data.order : currentCat.order,
        },
      });

      if (newName !== oldName) {
        await tx.skill.updateMany({
          where: { category: oldName },
          data: { category: newName },
        });
      }

      return category;
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update skill category' });
  }
});

// DELETE skill category
router.delete('/skill-categories/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const category = await prisma.skillCategory.findUnique({ where: { id } });
    if (!category) {
      res.status(404).json({ message: 'Skill category not found' });
      return;
    }

    await prisma.skillCategory.delete({ where: { id } });
    res.json({ message: 'Skill category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill category' });
  }
});

// EXPERIENCE CRUD
const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional(),
  logoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

router.post('/experiences', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = experienceSchema.parse(req.body);
    const exp = await prisma.experience.create({ data });
    res.status(201).json(exp);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create experience' });
  }
});

router.put('/experiences/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = experienceSchema.partial().parse(req.body);
    const updated = await prisma.experience.update({ where: { id }, data });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update experience' });
  }
});

router.delete('/experiences/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.experience.delete({ where: { id } });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete experience' });
  }
});

// EDUCATION CRUD
const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  current: z.boolean().optional(),
  grade: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

router.post('/educations', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = educationSchema.parse(req.body);
    const edu = await prisma.education.create({ data });
    res.status(201).json(edu);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create education' });
  }
});

router.put('/educations/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = educationSchema.partial().parse(req.body);
    const updated = await prisma.education.update({ where: { id }, data });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update education' });
  }
});

// SPECIALIZED SERVICES CRUD
const serviceSchema = z.object({
  title: z.string().min(1),
  icon: z.string().optional().nullable(),
  order: z.number().int().optional(),
});

router.post('/services', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.specializedService.create({ data });
    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create service' });
  }
});

router.put('/services/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = serviceSchema.partial().parse(req.body);
    const updated = await prisma.specializedService.update({ where: { id }, data });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update service' });
  }
});

router.delete('/services/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.specializedService.delete({ where: { id } });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete service' });
  }
});

export const profileRoutes = router;
