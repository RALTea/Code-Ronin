/*
  Warnings:

  - You are about to drop the column `fileId` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `taskId` to the `Attempt` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userSolution" TEXT NOT NULL,
    "isSuccess" BOOLEAN NOT NULL,
    "apprenticeId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "Attempt_apprenticeId_fkey" FOREIGN KEY ("apprenticeId") REFERENCES "Apprentice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attempt_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attempt" ("apprenticeId", "createdAt", "id", "isSuccess", "updatedAt", "userSolution") SELECT "apprenticeId", "createdAt", "id", "isSuccess", "updatedAt", "userSolution" FROM "Attempt";
DROP TABLE "Attempt";
ALTER TABLE "new_Attempt" RENAME TO "Attempt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
