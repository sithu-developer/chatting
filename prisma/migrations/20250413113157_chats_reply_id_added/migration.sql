/*
  Warnings:

  - You are about to drop the `ReplyChatRelations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReplyChatRelations" DROP CONSTRAINT "ReplyChatRelations_ToChatId_fkey";

-- DropForeignKey
ALTER TABLE "ReplyChatRelations" DROP CONSTRAINT "ReplyChatRelations_replyChatId_fkey";

-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "replyId" INTEGER;

-- DropTable
DROP TABLE "ReplyChatRelations";

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
