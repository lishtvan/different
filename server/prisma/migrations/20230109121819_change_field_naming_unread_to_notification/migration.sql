/*
  Warnings:

  - You are about to drop the column `unread` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "unread",
ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT true;
