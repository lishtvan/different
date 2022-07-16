/*
  Warnings:

  - You are about to drop the column `avatarKey` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `imageKeys` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile"
RENAME COLUMN "avatarKey" TO "avatarUrl";

-- AlterTable
ALTER TABLE "Sale"
RENAME COLUMN "imageKeys" TO "imageUrls";
