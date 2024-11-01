/*
  Warnings:

  - You are about to drop the column `gainedPoint` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `instruction` on the `Task` table. All the data in the column will be lost.
  - Added the required column `instructions` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL DEFAULT 1,
    "answerType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questId" TEXT NOT NULL,
    CONSTRAINT "Task_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("instructions", "exp", "answerType", "createdAt", "id", "name", "order", "questId", "updatedAt") SELECT "instruction", "gainedPoint", "answerType", "createdAt", "id", "name", "order", "questId", "updatedAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
