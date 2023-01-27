/*
  Warnings:

  - Added the required column `some` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "some" TEXT NOT NULL;
