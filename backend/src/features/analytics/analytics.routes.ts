import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../../core/db';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

const pingSchema = z.object({
  sessionId: z.string().min(4),
  device: z.string().optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
  path: z.string().optional(),
  additionalSeconds: z.number().int().min(0).max(300).optional(),
});

// POST /api/analytics/ping (Public - called periodically by visitor client)
router.post('/ping', async (req: Request, res: Response) => {
  try {
    const data = pingSchema.parse(req.body);

    const existing = await prisma.visitorActivity.findFirst({
      where: { sessionId: data.sessionId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      const updated = await prisma.visitorActivity.update({
        where: { id: existing.id },
        data: {
          durationSeconds: {
            increment: data.additionalSeconds || 5,
          },
          path: data.path || existing.path,
          lastPingAt: new Date(),
        },
      });
      res.json({ success: true, activityId: updated.id });
    } else {
      const created = await prisma.visitorActivity.create({
        data: {
          sessionId: data.sessionId,
          device: data.device || 'Desktop',
          browser: data.browser || 'Unknown',
          referrer: data.referrer || 'Direct',
          path: data.path || '/',
          durationSeconds: data.additionalSeconds || 5,
        },
      });
      res.status(201).json({ success: true, activityId: created.id });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to record ping' });
  }
});

// GET /api/analytics (Admin only - returns stats + activities list)
router.get('/', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    const [activities, totalSessions, totalDuration] = await Promise.all([
      prisma.visitorActivity.findMany({
        orderBy: { lastPingAt: 'desc' },
        take: 200,
      }),
      prisma.visitorActivity.count(),
      prisma.visitorActivity.aggregate({
        _sum: {
          durationSeconds: true,
        },
        _avg: {
          durationSeconds: true,
        },
      }),
    ]);

    res.json({
      stats: {
        totalSessions,
        totalDurationSeconds: totalDuration._sum.durationSeconds || 0,
        avgDurationSeconds: Math.round(totalDuration._avg.durationSeconds || 0),
      },
      activities,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// DELETE /api/analytics/bulk (Admin only - delete selected activity logs)
router.post('/delete-batch', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ message: 'No activity IDs provided' });
      return;
    }

    const result = await prisma.visitorActivity.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    res.json({ success: true, count: result.count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity entries' });
  }
});

// DELETE all logs (Admin only)
router.delete('/clear-all', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await prisma.visitorActivity.deleteMany({});
    res.json({ success: true, count: result.count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear activity logs' });
  }
});

export const analyticsRoutes = router;
