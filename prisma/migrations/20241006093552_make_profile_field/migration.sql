/*
  Warnings:

  - You are about to drop the column `pforile` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "pforile",
ADD COLUMN     "profile" TEXT;
