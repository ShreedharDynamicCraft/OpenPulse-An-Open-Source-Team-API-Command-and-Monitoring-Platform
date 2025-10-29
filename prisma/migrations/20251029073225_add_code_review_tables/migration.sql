-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('EMPATHETIC', 'GITHUB_REPO');

-- CreateTable
CREATE TABLE "CodeReviewProject" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeReviewProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeReviewLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "reviewType" "ReviewType" NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT,
    "language" TEXT,
    "response" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tone" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeReviewProject_workspaceId_idx" ON "CodeReviewProject"("workspaceId");

-- CreateIndex
CREATE INDEX "CodeReviewLog_workspaceId_createdAt_idx" ON "CodeReviewLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "CodeReviewLog_userId_idx" ON "CodeReviewLog"("userId");

-- CreateIndex
CREATE INDEX "CodeReviewLog_projectId_idx" ON "CodeReviewLog"("projectId");

-- CreateIndex
CREATE INDEX "CodeReviewLog_reviewType_idx" ON "CodeReviewLog"("reviewType");

-- AddForeignKey
ALTER TABLE "CodeReviewLog" ADD CONSTRAINT "CodeReviewLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CodeReviewProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
