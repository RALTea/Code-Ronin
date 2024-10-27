/*
  Warnings:

  - You are about to drop the column `nextQuestId` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the column `nextTaskId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `email` to the `Apprentice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `giteaUserId` to the `Apprentice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_Quests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Quests_A_fkey" FOREIGN KEY ("A") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Quests_B_fkey" FOREIGN KEY ("B") REFERENCES "Quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_Tasks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Tasks_A_fkey" FOREIGN KEY ("A") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Tasks_B_fkey" FOREIGN KEY ("B") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apprentice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "giteaUserId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "profilePicture" TEXT NOT NULL
);
INSERT INTO "new_Apprentice" ("createdAt", "id", "profilePicture", "role", "updatedAt", "username") SELECT "createdAt", "id", "profilePicture", "role", "updatedAt", "username" FROM "Apprentice";
DROP TABLE "Apprentice";
ALTER TABLE "new_Apprentice" RENAME TO "Apprentice";
CREATE TABLE "new_Quest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "forceOpen" BOOLEAN,
    "openAt" DATETIME,
    "closeAt" DATETIME,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Quest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quest" ("campaignId", "closeAt", "createdAt", "forceOpen", "id", "name", "openAt", "resume", "updatedAt") SELECT "campaignId", "closeAt", "createdAt", "forceOpen", "id", "name", "openAt", "resume", "updatedAt" FROM "Quest";
DROP TABLE "Quest";
ALTER TABLE "new_Quest" RENAME TO "Quest";
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "gainedPoint" INTEGER,
    "answerType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questId" TEXT NOT NULL,
    CONSTRAINT "Task_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("answerType", "createdAt", "gainedPoint", "id", "instruction", "name", "order", "questId", "updatedAt") SELECT "answerType", "createdAt", "gainedPoint", "id", "instruction", "name", "order", "questId", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_Quests_AB_unique" ON "_Quests"("A", "B");

-- CreateIndex
CREATE INDEX "_Quests_B_index" ON "_Quests"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Tasks_AB_unique" ON "_Tasks"("A", "B");

-- CreateIndex
CREATE INDEX "_Tasks_B_index" ON "_Tasks"("B");
