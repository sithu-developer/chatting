/*
  Warnings:

  - Added the required column `seen` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chats" ADD COLUMN     "seen" BOOLEAN NOT NULL;
