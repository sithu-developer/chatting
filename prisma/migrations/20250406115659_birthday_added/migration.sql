/*
  Warnings:

  - Added the required column `day` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `month` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "day" INTEGER NOT NULL,
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
