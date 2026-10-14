import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const themeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  bg: z.string().min(4),
  surface: z.string().min(4),
  border: z.string().min(4),
  text: z.string().min(4),
  textMuted: z.string().min(4),
  accent: z.string().min(4),
  isDefault: z.boolean().optional(),
});

// GET all themes (public)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { createdAt: 'asc' },
    });
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch themes' });
  }
});

// POST new theme (admin only)
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const data = themeSchema.parse(req.body);

    if (data.isDefault) {
      // Unset previous defaults
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const newTheme = await prisma.theme.create({
      data: {
        name: data.name,
        slug: data.slug,
        bg: data.bg,
        surface: data.surface,
        border: data.border,
        text: data.text,
        textMuted: data.textMuted,
        accent: data.accent,
        isDefault: data.isDefault ?? false,
      },
    });

    res.status(201).json(newTheme);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create theme' });
  }
});

// PUT update theme (admin only)
router.put('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = themeSchema.partial().parse(req.body);

    if (data.isDefault) {
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.theme.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update theme' });
  }
});

// DELETE theme (admin only)
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.theme.delete({ where: { id } });
    res.json({ message: 'Theme deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete theme' });
  }
});

export const themeRoutes = router;
