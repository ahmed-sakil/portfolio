import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const messageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  purpose: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

// POST send message (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = messageSchema.parse(req.body);
    const msg = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        purpose: data.purpose,
        company: data.company,
        subject: data.subject || data.purpose || 'Portfolio Inquiry',
        message: data.message,
      },
    });
    res.status(201).json({ success: true, message: 'Message sent successfully!', id: msg.id });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to submit message' });
  }
});

// GET all messages (admin)
router.get('/', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// PATCH toggle isRead status (admin)
router.patch('/:id/read', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { isRead } = req.body;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: Boolean(isRead) },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update message status' });
  }
});

// DELETE message (admin)
router.delete('/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

export const messageRoutes = router;
