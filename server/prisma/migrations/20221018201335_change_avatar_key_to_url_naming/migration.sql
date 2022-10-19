/*
  Warnings:

  - You are about to drop the column `avatarKey` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarKey",
ADD COLUMN     "avatarUrl" TEXT;
