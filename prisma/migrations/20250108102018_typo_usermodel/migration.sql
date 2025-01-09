/*
  Warnings:

  - You are about to drop the column `lastanem` on the `User` table. All the data in the column will be lost.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastanem",
ADD COLUMN     "lastname" TEXT NOT NULL;
