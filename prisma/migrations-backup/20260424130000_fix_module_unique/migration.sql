-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT IF EXISTS "Module_slug_key";
ALTER TABLE "Module" ADD CONSTRAINT "Module_userId_slug_unique" UNIQUE ("userId", "slug");
