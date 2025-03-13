/*
  Warnings:

  - Added the required column `date` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contactId" TEXT NOT NULL,
    CONSTRAINT "note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_note" ("contactId", "content", "createdAt", "id", "updatedAt") SELECT "contactId", "content", "createdAt", "id", "updatedAt" FROM "note";
DROP TABLE "note";
ALTER TABLE "new_note" RENAME TO "note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
