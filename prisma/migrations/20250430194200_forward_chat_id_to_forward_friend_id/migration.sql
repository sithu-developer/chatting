/*
  Warnings:

  - You are about to drop the column `forwardChatId` on the `Chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_forwardChatId_fkey";

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "forwardChatId",
ADD COLUMN     "forwardFriendId" INTEGER;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_forwardFriendId_fkey" FOREIGN KEY ("forwardFriendId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
