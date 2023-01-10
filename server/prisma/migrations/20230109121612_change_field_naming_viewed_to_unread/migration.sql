/*
  Warnings:

  - You are about to drop the column `viewed` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "viewed",
ADD COLUMN     "unread" BOOLEAN NOT NULL DEFAULT false;
