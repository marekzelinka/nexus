-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contactId" TEXT NOT NULL,
    CONSTRAINT "note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
