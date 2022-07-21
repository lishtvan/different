/*
  Warnings:

  - You are about to drop the column `accountId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_accountId_fkey";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "accountId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "accountId",
ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "Account";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" VARCHAR(20),
    "bio" TEXT,
    "avatarKey" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
