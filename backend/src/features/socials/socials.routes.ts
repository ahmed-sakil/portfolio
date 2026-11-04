import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const socialSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  link: z.string().url(),
  showOnHero: z.boolean().optional(),
  order: z.number().int().optional(),
});

// GET socials (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { position } = req.query; // 'hero'
    const where: any = {};
    if (position === 'hero') where.showOnHero = true;

    const socials = await prisma.socialLink.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(socials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch social links' });
  }
});

// POST social (admin)
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = socialSchema.parse(req.body);
    const social = await prisma.socialLink.create({
      data: {
        title: data.title,
        icon: data.icon,
        link: data.link,
        showOnHero: data.showOnHero ?? true,
        order: data.order ?? 0,
      },
    });
    res.status(201).json(social);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create social link' });
  }
});

// PUT social (admin)
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = socialSchema.partial().parse(req.body);
    const updated = await prisma.socialLink.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update social link' });
  }
});

// DELETE social (admin)
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.socialLink.delete({ where: { id } });
    res.json({ message: 'Social link deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete social link' });
  }
});

export const socialRoutes = router;
