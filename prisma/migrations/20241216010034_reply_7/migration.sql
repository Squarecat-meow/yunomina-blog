/*
  Warnings:

  - Changed the type of `githubId` on the `reply` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "reply" DROP COLUMN "githubId",
ADD COLUMN     "githubId" INTEGER NOT NULL;
