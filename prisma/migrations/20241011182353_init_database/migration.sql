-- CreateTable
CREATE TABLE "Apprentice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "profilePicture" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "forceOpen" BOOLEAN,
    "openAt" DATETIME,
    "closeAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "resume" TEXT NOT NULL,
    "forceOpen" BOOLEAN,
    "openAt" DATETIME,
    "closeAt" DATETIME,
    "nextQuestId" TEXT,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Quest_nextQuestId_fkey" FOREIGN KEY ("nextQuestId") REFERENCES "Quest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Quest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "gainedPoint" INTEGER,
    "answerType" TEXT NOT NULL,
    "nextTaskId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questId" TEXT NOT NULL,
    CONSTRAINT "Task_nextTaskId_fkey" FOREIGN KEY ("nextTaskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userSolution" TEXT NOT NULL,
    "isSuccess" BOOLEAN NOT NULL,
    "apprenticeId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    CONSTRAINT "Attempt_apprenticeId_fkey" FOREIGN KEY ("apprenticeId") REFERENCES "Apprentice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attempt_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ApprenticeToCampaign" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ApprenticeToCampaign_A_fkey" FOREIGN KEY ("A") REFERENCES "Apprentice" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ApprenticeToCampaign_B_fkey" FOREIGN KEY ("B") REFERENCES "Campaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Quest_nextQuestId_key" ON "Quest"("nextQuestId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_nextTaskId_key" ON "Task"("nextTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "_ApprenticeToCampaign_AB_unique" ON "_ApprenticeToCampaign"("A", "B");

-- CreateIndex
CREATE INDEX "_ApprenticeToCampaign_B_index" ON "_ApprenticeToCampaign"("B");
