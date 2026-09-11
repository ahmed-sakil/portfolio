-- AlterTable Profile
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "full_name" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "role" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "title" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "years_of_experience" INTEGER;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "resume_drive_link" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "profile_image_url" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "hero_image_url" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "icon_image_url" TEXT;

-- AlterTable ContactMessage
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "reason" TEXT;
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "company" TEXT;

-- AlterTable SocialLink
ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0;

-- CreateTable Service
CREATE TABLE IF NOT EXISTS "Service" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon_name" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable Theme
CREATE TABLE IF NOT EXISTS "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "bg_base" TEXT NOT NULL,
    "bg_surface" TEXT NOT NULL,
    "text_primary" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Theme_name_key" ON "Theme"("name");
