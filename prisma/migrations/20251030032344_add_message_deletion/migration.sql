/*
  Warnings:

  - You are about to drop the `DesignActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DesignShare` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FigmaConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkspaceMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DesignShare" DROP CONSTRAINT "DesignShare_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MessageAttachment" DROP CONSTRAINT "MessageAttachment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkspaceMessage" DROP CONSTRAINT "WorkspaceMessage_replyToId_fkey";

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "deletedForEveryone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedForUsers" JSONB;

-- DropTable
DROP TABLE "public"."DesignActivity";

-- DropTable
DROP TABLE "public"."DesignShare";

-- DropTable
DROP TABLE "public"."FigmaConnection";

-- DropTable
DROP TABLE "public"."MessageAttachment";

-- DropTable
DROP TABLE "public"."Notification";

-- DropTable
DROP TABLE "public"."WorkspaceMessage";

-- DropEnum
DROP TYPE "public"."NOTIFICATION_TYPE";
