import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const authorSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  icon: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
});

// GET all authors
router.get('/', async (_req: Request, res: Response) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch authors' });
  }
});

// POST new author (admin only)
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = authorSchema.parse(req.body);
    const author = await prisma.author.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        portfolioUrl: data.portfolioUrl || null,
      },
    });
    res.status(201).json(author);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create author' });
  }
});

// PUT update author (admin only)
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = authorSchema.partial().parse(req.body);
    const updated = await prisma.author.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update author' });
  }
});

// DELETE author (admin only)
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.author.delete({ where: { id } });
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete author' });
  }
});

export const authorRoutes = router;
