/*
  Warnings:

  - A unique constraint covering the columns `[intDocRef]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "intDocRef" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_intDocRef_key" ON "Order"("intDocRef");
