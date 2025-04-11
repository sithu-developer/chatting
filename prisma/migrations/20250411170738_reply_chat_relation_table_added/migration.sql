/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `Chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_fromUserId_fkey";

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "fromUserId";

-- CreateTable
CREATE TABLE "ReplyChatRelations" (
    "id" SERIAL NOT NULL,
    "replyChatId" INTEGER NOT NULL,
    "ToChatId" INTEGER NOT NULL,

    CONSTRAINT "ReplyChatRelations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReplyChatRelations" ADD CONSTRAINT "ReplyChatRelations_replyChatId_fkey" FOREIGN KEY ("replyChatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyChatRelations" ADD CONSTRAINT "ReplyChatRelations_ToChatId_fkey" FOREIGN KEY ("ToChatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
