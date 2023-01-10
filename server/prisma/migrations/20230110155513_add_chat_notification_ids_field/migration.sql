/*
  Warnings:

  - You are about to drop the column `notification` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "notification";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatNotificationIds" INTEGER[];
