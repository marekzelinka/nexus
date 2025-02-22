/*
  Warnings:

  - Added the required column `updatedAt` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first" TEXT,
    "last" TEXT,
    "avatar" TEXT,
    "favorite" BOOLEAN,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_contact" ("avatar", "favorite", "first", "id", "last", "userId") SELECT "avatar", "favorite", "first", "id", "last", "userId" FROM "contact";
DROP TABLE "contact";
ALTER TABLE "new_contact" RENAME TO "contact";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
