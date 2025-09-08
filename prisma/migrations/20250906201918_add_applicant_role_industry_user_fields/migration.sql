/*
  Warnings:

  - You are about to drop the column `jobField` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "jobField",
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "jobRole" TEXT;
