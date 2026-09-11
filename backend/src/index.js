import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes/index.js';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Basic Health Route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running' });
});

// Port
const PORT = process.env.PORT || 5000;

async function autoMigrate() {
  const statements = [
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "hero_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "icon_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "journey_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "favicon_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "connect_message" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "resume_drive_link" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "years_of_experience" INTEGER`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "role" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "full_name" TEXT`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "reason" TEXT`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "company" TEXT`,
    `CREATE TABLE IF NOT EXISTS "Service" (
        "id" SERIAL NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "icon_name" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS "Theme" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "primary_color" TEXT NOT NULL,
        "secondary_color" TEXT,
        "background_color" TEXT,
        "text_color" TEXT,
        "is_active" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
    )`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "show_in_hero" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "show_in_footer" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0`,
    `CREATE TABLE IF NOT EXISTS "AdminUser" (
        "id" SERIAL NOT NULL,
        "username" TEXT NOT NULL,
        "email" TEXT,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username")`
  ];

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (e) {
      // Ignore if table/column already exists or minor error
    }
  }
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await autoMigrate();
});
