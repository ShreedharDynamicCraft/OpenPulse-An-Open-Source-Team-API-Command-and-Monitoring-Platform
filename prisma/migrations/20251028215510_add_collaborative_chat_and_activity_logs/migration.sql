-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'CODE', 'FILE', 'SYSTEM', 'AI_RESPONSE');

-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('TEST_RUN', 'COLLECTION_RUN', 'ERROR', 'SYSTEM', 'DEPLOYMENT', 'BUILD', 'API_CALL');

-- AlterTable
ALTER TABLE "WorkspaceMessage" ADD COLUMN     "isDirectMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipientId" TEXT;

-- CreateTable
CREATE TABLE "MessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "aiResponse" BOOLEAN NOT NULL DEFAULT false,
    "aiModel" TEXT,
    "aiPrompt" TEXT,
    "codeLanguage" TEXT,
    "githubUrl" TEXT,
    "parentId" TEXT,
    "attachmentUrl" TEXT,
    "attachmentName" TEXT,
    "attachmentType" TEXT,
    "attachmentSize" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "LogType" NOT NULL,
    "title" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "status" TEXT,
    "duration" INTEGER,
    "statusCode" INTEGER,
    "requestId" TEXT,
    "collectionId" TEXT,
    "relatedChatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageAttachment_messageId_idx" ON "MessageAttachment"("messageId");

-- CreateIndex
CREATE INDEX "ChatMessage_workspaceId_createdAt_idx" ON "ChatMessage"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_parentId_idx" ON "ChatMessage"("parentId");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_workspaceId_idx" ON "ChatMessage"("userId", "workspaceId");

-- CreateIndex
CREATE INDEX "MessageReaction_messageId_idx" ON "MessageReaction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_emoji_key" ON "MessageReaction"("messageId", "userId", "emoji");

-- CreateIndex
CREATE INDEX "ActivityLog_workspaceId_createdAt_idx" ON "ActivityLog"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_createdAt_idx" ON "ActivityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_type_workspaceId_idx" ON "ActivityLog"("type", "workspaceId");

-- CreateIndex
CREATE INDEX "WorkspaceMessage_recipientId_createdAt_idx" ON "WorkspaceMessage"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkspaceMessage_userId_recipientId_idx" ON "WorkspaceMessage"("userId", "recipientId");

-- AddForeignKey
ALTER TABLE "WorkspaceMessage" ADD CONSTRAINT "WorkspaceMessage_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "WorkspaceMessage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MessageAttachment" ADD CONSTRAINT "MessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "WorkspaceMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
