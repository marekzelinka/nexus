-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "first" TEXT,
    "last" TEXT,
    "avatar" TEXT,
    "favorite" BOOLEAN,
    "userId" TEXT NOT NULL,
    CONSTRAINT "contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
