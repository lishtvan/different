/*
  Warnings:

  - You are about to drop the column `avatar` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "avatar",
ADD COLUMN     "avatarKey" TEXT;

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "imageKey" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
