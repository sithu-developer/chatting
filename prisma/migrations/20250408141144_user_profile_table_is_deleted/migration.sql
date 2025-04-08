/*
  Warnings:

  - You are about to drop the `UserProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfiles" DROP CONSTRAINT "UserProfiles_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileUrl" TEXT;

-- DropTable
DROP TABLE "UserProfiles";
