-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'BOOLEAN',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "icon" TEXT NOT NULL DEFAULT 'star',
    "color" TEXT NOT NULL DEFAULT 'slate',
    "order" INTEGER DEFAULT 0,
    "pointsIfTrue" REAL DEFAULT 1,
    "pointsIfFalse" REAL DEFAULT 0,
    "pointsPerUnit" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deactivatedAt" DATETIME,
    "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("color", "createdAt", "deactivatedAt", "description", "icon", "id", "isActive", "pointsIfFalse", "pointsIfTrue", "pointsPerUnit", "status", "title", "type", "userId") SELECT "color", "createdAt", "deactivatedAt", "description", "icon", "id", "isActive", "pointsIfFalse", "pointsIfTrue", "pointsPerUnit", "status", "title", "type", "userId" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
