import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
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

// Dedicated DB Sync trigger route
app.get('/api/health/db-sync', async (req, res) => {
  try {
    await autoMigrate();
    res.json({ success: true, message: 'Database schema synchronized successfully.' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Port
const PORT = process.env.PORT || 5000;

async function autoMigrate() {
  // Step 1: Attempt prisma db push
  try {
    console.log('[DB Sync] Running prisma db push to synchronize PostgreSQL schema...');
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      timeout: 45000,
      env: { ...process.env }
    });
    console.log('[DB Sync] Prisma db push completed successfully.');
  } catch (err) {
    console.warn('[DB Sync] Prisma db push CLI notice (falling back to direct SQL execution):', err.message);
  }

  // Step 2: Comprehensive raw SQL fallback to ensure all tables, types, and columns exist
  const statements = [
    // Enum
    `DO $$ BEGIN
        CREATE TYPE "SkillCategory" AS ENUM ('PROGRAMMING_LANGUAGE', 'MARKUP_STYLING', 'DATABASE', 'LIBRARY', 'TOOL', 'PLATFORM', 'TECHNOLOGY', 'OTHER');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;`,

    // Profile table
    `CREATE TABLE IF NOT EXISTS "Profile" (
        "id" SERIAL PRIMARY KEY,
        "full_name" TEXT,
        "role" TEXT,
        "title" TEXT,
        "bio" TEXT,
        "journey_text" TEXT,
        "years_of_experience" INTEGER,
        "career_start_date" TIMESTAMP(3),
        "email" TEXT,
        "phone" TEXT,
        "location" TEXT,
        "resume_url" TEXT,
        "resume_drive_link" TEXT,
        "profile_image_url" TEXT,
        "hero_image_url" TEXT,
        "icon_image_url" TEXT,
        "journey_image_url" TEXT,
        "favicon_url" TEXT,
        "connect_message" TEXT,
        "github_username" TEXT,
        "leetcode_username" TEXT,
        "codeforces_username" TEXT
    )`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "full_name" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "role" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "title" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "bio" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "journey_text" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "years_of_experience" INTEGER`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "career_start_date" TIMESTAMP(3)`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "email" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "phone" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "location" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "resume_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "resume_drive_link" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "profile_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "hero_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "icon_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "journey_image_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "favicon_url" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "connect_message" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "github_username" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "leetcode_username" TEXT`,
    `ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "codeforces_username" TEXT`,

    // Skill table
    `CREATE TABLE IF NOT EXISTS "Skill" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "category" "SkillCategory" NOT NULL DEFAULT 'PROGRAMMING_LANGUAGE',
        "percentage" INTEGER NOT NULL DEFAULT 50,
        "icon_name" TEXT
    )`,

    // Experience table
    `CREATE TABLE IF NOT EXISTS "Experience" (
        "id" SERIAL PRIMARY KEY,
        "type" TEXT NOT NULL DEFAULT 'EXPERIENCE',
        "title" TEXT NOT NULL,
        "company" TEXT NOT NULL,
        "institution_url" TEXT,
        "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "end_date" TIMESTAMP(3),
        "is_current" BOOLEAN NOT NULL DEFAULT false,
        "description" TEXT,
        "result" TEXT
    )`,

    // Project table
    `CREATE TABLE IF NOT EXISTS "Project" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "live_link" TEXT,
        "github_link" TEXT,
        "tech_stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "is_featured" BOOLEAN NOT NULL DEFAULT true,
        "priority" INTEGER NOT NULL DEFAULT 0
    )`,
    `ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0`,

    // Blog table
    `CREATE TABLE IF NOT EXISTS "Blog" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "content" TEXT NOT NULL DEFAULT '',
        "cover_image_url" TEXT,
        "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_featured" BOOLEAN NOT NULL DEFAULT true,
        "priority" INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Blog_slug_key" ON "Blog"("slug")`,
    `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "is_featured" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "priority" INTEGER NOT NULL DEFAULT 0`,

    // SocialLink table
    `CREATE TABLE IF NOT EXISTS "SocialLink" (
        "id" SERIAL PRIMARY KEY,
        "platform" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "icon_name" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "show_in_hero" BOOLEAN NOT NULL DEFAULT true,
        "show_in_footer" BOOLEAN NOT NULL DEFAULT true
    )`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "show_in_hero" BOOLEAN NOT NULL DEFAULT true`,
    `ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "show_in_footer" BOOLEAN NOT NULL DEFAULT true`,

    // Service table
    `CREATE TABLE IF NOT EXISTS "Service" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "icon_name" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    `ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,

    // Theme table
    `CREATE TABLE IF NOT EXISTS "Theme" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "accent" TEXT NOT NULL DEFAULT '#00e5a0',
        "bg_base" TEXT NOT NULL DEFAULT '#0a0f1e',
        "bg_surface" TEXT NOT NULL DEFAULT 'rgba(15, 23, 42, 0.65)',
        "text_primary" TEXT NOT NULL DEFAULT '#f8fafc',
        "is_active" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Theme_name_key" ON "Theme"("name")`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "accent" TEXT NOT NULL DEFAULT '#00e5a0'`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "bg_base" TEXT NOT NULL DEFAULT '#0a0f1e'`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "bg_surface" TEXT NOT NULL DEFAULT 'rgba(15, 23, 42, 0.65)'`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "text_primary" TEXT NOT NULL DEFAULT '#f8fafc'`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT false`,
    `ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,

    // ContactMessage table
    `CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "reason" TEXT,
        "company" TEXT,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_read" BOOLEAN NOT NULL DEFAULT false
    )`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "reason" TEXT`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "company" TEXT`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
    `ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "is_read" BOOLEAN NOT NULL DEFAULT false`,

    // AdminUser table
    `CREATE TABLE IF NOT EXISTS "AdminUser" (
        "id" SERIAL PRIMARY KEY,
        "username" TEXT NOT NULL,
        "email" TEXT,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username")`,

    // Ensure at least 1 default profile exists so updates don't fail
    `INSERT INTO "Profile" ("id", "full_name", "role", "connect_message")
     SELECT 1, 'Developer', 'Full Stack Developer', 'Let us build something amazing together.'
     WHERE NOT EXISTS (SELECT 1 FROM "Profile")`,

    // Ensure at least 1 default active theme exists
    `INSERT INTO "Theme" ("name", "accent", "bg_base", "bg_surface", "text_primary", "is_active")
     SELECT 'Emerald Cyber', '#00e5a0', '#0a0f1e', 'rgba(15, 23, 42, 0.65)', '#f8fafc', true
     WHERE NOT EXISTS (SELECT 1 FROM "Theme")`
  ];

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt);
    } catch (e) {
      // Ignore if minor error
    }
  }
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await autoMigrate();
});
