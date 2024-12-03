/*
  Warnings:

  - You are about to drop the column `owner` on the `category` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
