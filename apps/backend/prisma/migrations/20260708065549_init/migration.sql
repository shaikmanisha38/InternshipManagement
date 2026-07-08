-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "githubId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'INTERN'
);

-- CreateTable
CREATE TABLE "Intern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Intern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeekProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "internId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "WeekProgress_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LeaderboardEntry_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "internId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    CONSTRAINT "Certificate_internId_fkey" FOREIGN KEY ("internId") REFERENCES "Intern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Intern_userId_key" ON "Intern"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_internId_key" ON "LeaderboardEntry"("internId");
