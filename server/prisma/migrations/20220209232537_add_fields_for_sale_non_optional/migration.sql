/*
  Warnings:

  - Added the required column `condition` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "condition" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL;
