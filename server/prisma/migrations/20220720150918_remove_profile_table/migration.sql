/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nickname]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_accountId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "avatarKey" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "nickname" VARCHAR(20),
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "Account_nickname_key" ON "Account"("nickname");
