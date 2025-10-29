/*
  Warnings:

  - You are about to drop the column `code` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `reviewType` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CodeReviewLog` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `CodeReviewLog` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `CodeReviewLog` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create new enums
CREATE TYPE "ReviewSessionType" AS ENUM ('PROJECT_BASED', 'STANDALONE');
ALTER TYPE "ReviewType" ADD VALUE 'GENERAL';

-- Step 2: Create CodeReviewSession table first
CREATE TABLE "CodeReviewSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "sessionType" "ReviewSessionType" NOT NULL DEFAULT 'STANDALONE',
    "reviewType" "ReviewType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "language" TEXT,
    "filesPaths" JSONB,
    "tone" TEXT,
    "model" TEXT NOT NULL,
    "originalComments" JSONB,
    "tags" JSONB,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeReviewSession_pkey" PRIMARY KEY ("id")
);

-- Step 3: Migrate existing CodeReviewLog data to CodeReviewSession
-- Create sessions from existing logs
INSERT INTO "CodeReviewSession" (
    "id",
    "workspaceId",
    "userId",
    "projectId",
    "sessionType",
    "reviewType",
    "name",
    "description",
    "code",
    "language",
    "tone",
    "model",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    "workspaceId",
    "userId",
    "projectId",
    CASE WHEN "projectId" IS NOT NULL THEN 'PROJECT_BASED'::"ReviewSessionType" ELSE 'STANDALONE'::"ReviewSessionType" END,
    "reviewType",
    COALESCE("title", 'Migrated Review'),
    'Automatically migrated from old structure',
    "code",
    "language",
    "tone",
    "model",
    "createdAt",
    "createdAt"
FROM "CodeReviewLog";

-- Step 4: Add sessionId column with temporary nullable
ALTER TABLE "CodeReviewLog" ADD COLUMN "sessionId" TEXT;

-- Step 5: Update existing logs with new session IDs
-- Match logs to sessions based on workspace, user, and creation time
UPDATE "CodeReviewLog" cl
SET "sessionId" = (
    SELECT s."id"
    FROM "CodeReviewSession" s
    WHERE s."workspaceId" = cl."workspaceId"
    AND s."userId" = cl."userId"
    AND s."createdAt" = cl."createdAt"
    LIMIT 1
);

-- Step 6: Make sessionId required
ALTER TABLE "CodeReviewLog" ALTER COLUMN "sessionId" SET NOT NULL;

-- Step 7: Drop old foreign keys and indexes
ALTER TABLE "CodeReviewLog" DROP CONSTRAINT IF EXISTS "CodeReviewLog_projectId_fkey";
DROP INDEX IF EXISTS "CodeReviewLog_projectId_idx";
DROP INDEX IF EXISTS "CodeReviewLog_reviewType_idx";
DROP INDEX IF EXISTS "CodeReviewLog_userId_idx";
DROP INDEX IF EXISTS "CodeReviewLog_workspaceId_createdAt_idx";

-- Step 8: Drop old columns and add new ones
ALTER TABLE "CodeReviewLog" 
DROP COLUMN "code",
DROP COLUMN "language",
DROP COLUMN "projectId",
DROP COLUMN "reviewType",
DROP COLUMN "title",
DROP COLUMN "userId",
DROP COLUMN "workspaceId",
ADD COLUMN "codeSnapshot" TEXT,
ADD COLUMN "commentsSnapshot" JSONB,
ADD COLUMN "error" TEXT,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'success';

-- Step 9: Create new indexes
CREATE INDEX "CodeReviewSession_workspaceId_idx" ON "CodeReviewSession"("workspaceId");
CREATE INDEX "CodeReviewSession_userId_idx" ON "CodeReviewSession"("userId");
CREATE INDEX "CodeReviewSession_projectId_idx" ON "CodeReviewSession"("projectId");
CREATE INDEX "CodeReviewSession_sessionType_idx" ON "CodeReviewSession"("sessionType");
CREATE INDEX "CodeReviewLog_sessionId_createdAt_idx" ON "CodeReviewLog"("sessionId", "createdAt");
CREATE INDEX "CodeReviewLog_status_idx" ON "CodeReviewLog"("status");
CREATE INDEX "CodeReviewProject_createdBy_idx" ON "CodeReviewProject"("createdBy");

-- Step 10: Add new foreign keys
ALTER TABLE "CodeReviewSession" ADD CONSTRAINT "CodeReviewSession_projectId_fkey" 
    FOREIGN KEY ("projectId") REFERENCES "CodeReviewProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CodeReviewLog" ADD CONSTRAINT "CodeReviewLog_sessionId_fkey" 
    FOREIGN KEY ("sessionId") REFERENCES "CodeReviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
