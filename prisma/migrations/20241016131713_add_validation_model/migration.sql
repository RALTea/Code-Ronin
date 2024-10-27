-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testFileUrl" TEXT,
    "expectedStdout" TEXT,
    "expectedStderr" TEXT,
    "taskId" TEXT NOT NULL,
    CONSTRAINT "Validation_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "validationId" TEXT NOT NULL,
    CONSTRAINT "Snippet_validationId_fkey" FOREIGN KEY ("validationId") REFERENCES "Validation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
