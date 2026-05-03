-- Fix module slug uniqueness for user-scoped modules
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'Module_slug_key'
  ) THEN
    ALTER TABLE "Module" DROP CONSTRAINT "Module_slug_key";
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_class
    WHERE relkind = 'i' AND relname = 'Module_slug_key'
  ) THEN
    DROP INDEX "Module_slug_key";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class
    WHERE relkind = 'i' AND relname = 'Module_userId_slug_key'
  ) THEN
    CREATE UNIQUE INDEX "Module_userId_slug_key" ON "Module"("userId", "slug");
  END IF;
END $$;
