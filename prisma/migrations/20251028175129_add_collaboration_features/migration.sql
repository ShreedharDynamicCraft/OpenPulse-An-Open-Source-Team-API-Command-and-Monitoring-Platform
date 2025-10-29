-- CreateEnum
CREATE TYPE "REQUEST_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ACTIVITY_TYPE" AS ENUM ('MEMBER_JOINED', 'MEMBER_LEFT', 'MEMBER_REMOVED', 'ROLE_CHANGED', 'ROLE_REQUESTED', 'ROLE_REQUEST_APPROVED', 'ROLE_REQUEST_REJECTED', 'COLLECTION_CREATED', 'COLLECTION_DELETED', 'REQUEST_CREATED', 'REQUEST_UPDATED', 'REQUEST_DELETED', 'MESSAGE_SENT');

-- CreateEnum
CREATE TYPE "NOTIFICATION_TYPE" AS ENUM ('ROLE_REQUEST', 'ROLE_CHANGE', 'MEMBER_JOINED', 'MEMBER_REMOVED', 'MENTION', 'SYSTEM');

-- CreateTable
CREATE TABLE "RoleUpgradeRequest" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "requestedRole" "MEMBER_ROLE" NOT NULL,
    "currentRole" "MEMBER_ROLE" NOT NULL,
    "message" TEXT,
    "status" "REQUEST_STATUS" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleUpgradeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceActivity" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ACTIVITY_TYPE" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMessage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userImage" TEXT,
    "message" TEXT NOT NULL,
    "replyToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkspaceMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "type" "NOTIFICATION_TYPE" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoleUpgradeRequest_workspaceId_status_idx" ON "RoleUpgradeRequest"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "WorkspaceActivity_workspaceId_createdAt_idx" ON "WorkspaceActivity"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkspaceMessage_workspaceId_createdAt_idx" ON "WorkspaceMessage"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");

-- AddForeignKey
ALTER TABLE "RoleUpgradeRequest" ADD CONSTRAINT "RoleUpgradeRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "WorkspaceMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
