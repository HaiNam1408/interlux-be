/*
  Warnings:

  - The `avatar` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "avatar",
ADD COLUMN     "avatar" JSONB;
