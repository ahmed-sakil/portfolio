import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

// GET profile overview (Profile, Skills, Experiences, Education, Specialized Services)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [profile, skills, experiences, educations, services] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
      prisma.experience.findMany({ orderBy: [{ startDate: 'desc' }, { order: 'asc' }] }),
      prisma.education.findMany({ orderBy: [{ startDate: 'desc' }, { order: 'asc' }] }),
      prisma.specializedService.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    ]);

    res.json({
      profile,
      skills,
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
