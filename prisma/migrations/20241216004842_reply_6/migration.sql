/*
  Warnings:

  - Added the required column `githubId` to the `reply` table without a default value. This is not possible if the table is not empty.
  - Made the column `text` on table `reply` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `reply` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "reply" ADD COLUMN     "githubId" TEXT NOT NULL,
ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
