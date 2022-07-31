/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "providerId" TEXT NOT NULL DEFAULT 'null';

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");
