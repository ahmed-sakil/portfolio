import express from 'express';
import cors from 'cors';
import { config } from './core/config';
import { authRoutes } from './features/auth/auth.routes';
import { themeRoutes } from './features/themes/themes.routes';
import { projectRoutes } from './features/projects/projects.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { socialRoutes } from './features/socials/socials.routes';
import { messageRoutes } from './features/messages/messages.routes';
import { uploadRoutes } from './features/upload/upload.routes';
import { analyticsRoutes } from './features/analytics/analytics.routes';
import { authorRoutes } from './features/authors/authors.routes';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Feature Routes
app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err?.message });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
});

export default app;
