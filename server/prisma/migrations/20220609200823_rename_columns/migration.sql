/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "imageUrls",
ADD COLUMN     "imageKeys" TEXT[];
