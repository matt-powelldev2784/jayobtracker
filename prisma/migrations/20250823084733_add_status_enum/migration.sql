/*
  Warnings:

  - Changed the type of `status` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('applied', 'interview', 'offer', 'rejected');

-- AlterTable
ALTER TABLE "public"."Application" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ApplicationStatus" NOT NULL;
