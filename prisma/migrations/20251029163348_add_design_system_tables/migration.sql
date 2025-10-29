-- CreateEnum
CREATE TYPE "DesignRole" AS ENUM ('OWNER', 'DESIGNER', 'COLLABORATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('PNG', 'SVG', 'PDF', 'FIG', 'JSON', 'REACT');

-- CreateEnum
CREATE TYPE "SuggestionType" AS ENUM ('COLOR_PALETTE', 'TYPOGRAPHY', 'SPACING', 'ACCESSIBILITY', 'COMPONENT', 'LAYOUT', 'COPY');

-- CreateTable
CREATE TABLE "DesignProject" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignFile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "figmaFileId" TEXT,
    "figmaFileKey" TEXT,
    "figmaNodeId" TEXT,
    "connectedByUserId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "latestVersionId" TEXT,
    "metadata" JSONB,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignVersion" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "versionTag" TEXT NOT NULL,
    "description" TEXT,
    "snapshotUrl" TEXT,
    "thumbnailUrl" TEXT,
    "metadata" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignComment" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "nodeId" TEXT,
    "positionX" DOUBLE PRECISION,
    "positionY" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesignComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AISuggestion" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "nodeId" TEXT,
    "suggestionType" "SuggestionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "payload" JSONB NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedBy" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "appliedToVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AISuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignExport" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "options" JSONB,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignPermission" (
    "id" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "projectId" TEXT,
    "fileId" TEXT,
    "userId" TEXT NOT NULL,
    "role" "DesignRole" NOT NULL,
    "grantedBy" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignShare" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "DesignRole" NOT NULL DEFAULT 'VIEWER',
    "password" TEXT,
    "expiresAt" TIMESTAMP(3),
    "maxViews" INTEGER,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "DesignShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FigmaConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "figmaUserId" TEXT,
    "figmaEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FigmaConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignActivity" (
    "id" TEXT NOT NULL,
    "fileId" TEXT,
    "projectId" TEXT,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DesignProject_workspaceId_idx" ON "DesignProject"("workspaceId");

-- CreateIndex
CREATE INDEX "DesignProject_ownerId_idx" ON "DesignProject"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignFile_figmaFileId_key" ON "DesignFile"("figmaFileId");

-- CreateIndex
CREATE INDEX "DesignFile_projectId_idx" ON "DesignFile"("projectId");

-- CreateIndex
CREATE INDEX "DesignFile_figmaFileId_idx" ON "DesignFile"("figmaFileId");

-- CreateIndex
CREATE INDEX "DesignFile_connectedByUserId_idx" ON "DesignFile"("connectedByUserId");

-- CreateIndex
CREATE INDEX "DesignVersion_fileId_createdAt_idx" ON "DesignVersion"("fileId", "createdAt");

-- CreateIndex
CREATE INDEX "DesignVersion_createdBy_idx" ON "DesignVersion"("createdBy");

-- CreateIndex
CREATE INDEX "DesignComment_fileId_resolved_idx" ON "DesignComment"("fileId", "resolved");

-- CreateIndex
CREATE INDEX "DesignComment_userId_idx" ON "DesignComment"("userId");

-- CreateIndex
CREATE INDEX "DesignComment_parentId_idx" ON "DesignComment"("parentId");

-- CreateIndex
CREATE INDEX "AISuggestion_fileId_suggestionType_idx" ON "AISuggestion"("fileId", "suggestionType");

-- CreateIndex
CREATE INDEX "AISuggestion_accepted_idx" ON "AISuggestion"("accepted");

-- CreateIndex
CREATE INDEX "DesignExport_versionId_format_idx" ON "DesignExport"("versionId", "format");

-- CreateIndex
CREATE INDEX "DesignExport_createdBy_idx" ON "DesignExport"("createdBy");

-- CreateIndex
CREATE INDEX "DesignPermission_userId_role_idx" ON "DesignPermission"("userId", "role");

-- CreateIndex
CREATE INDEX "DesignPermission_projectId_idx" ON "DesignPermission"("projectId");

-- CreateIndex
CREATE INDEX "DesignPermission_fileId_idx" ON "DesignPermission"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignPermission_resourceType_projectId_fileId_userId_key" ON "DesignPermission"("resourceType", "projectId", "fileId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignShare_token_key" ON "DesignShare"("token");

-- CreateIndex
CREATE INDEX "DesignShare_token_idx" ON "DesignShare"("token");

-- CreateIndex
CREATE INDEX "DesignShare_fileId_idx" ON "DesignShare"("fileId");

-- CreateIndex
CREATE INDEX "DesignShare_expiresAt_idx" ON "DesignShare"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "FigmaConnection_userId_key" ON "FigmaConnection"("userId");

-- CreateIndex
CREATE INDEX "FigmaConnection_userId_idx" ON "FigmaConnection"("userId");

-- CreateIndex
CREATE INDEX "DesignActivity_fileId_createdAt_idx" ON "DesignActivity"("fileId", "createdAt");

-- CreateIndex
CREATE INDEX "DesignActivity_projectId_createdAt_idx" ON "DesignActivity"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "DesignActivity_userId_idx" ON "DesignActivity"("userId");

-- AddForeignKey
ALTER TABLE "DesignProject" ADD CONSTRAINT "DesignProject_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignFile" ADD CONSTRAINT "DesignFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignVersion" ADD CONSTRAINT "DesignVersion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "DesignFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignComment" ADD CONSTRAINT "DesignComment_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "DesignFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignComment" ADD CONSTRAINT "DesignComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DesignComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AISuggestion" ADD CONSTRAINT "AISuggestion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "DesignFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignExport" ADD CONSTRAINT "DesignExport_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "DesignVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPermission" ADD CONSTRAINT "DesignPermission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "DesignProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignPermission" ADD CONSTRAINT "DesignPermission_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "DesignFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignShare" ADD CONSTRAINT "DesignShare_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "DesignFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
