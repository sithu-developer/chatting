-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "forwardChatId" INTEGER,
ADD COLUMN     "isPin" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_forwardChatId_fkey" FOREIGN KEY ("forwardChatId") REFERENCES "Chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
