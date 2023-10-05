/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "cardNumber",
DROP COLUMN "phone";
