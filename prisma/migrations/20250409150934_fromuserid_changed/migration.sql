/*
  Warnings:

  - You are about to drop the column `fromUser` on the `Chats` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "fromUser",
ADD COLUMN     "fromUserId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
