/*
  Warnings:

  - You are about to drop the `blogSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "blogSetting";

-- CreateTable
CREATE TABLE "emojis" (
    "id" SERIAL NOT NULL,
    "aliases" TEXT[],
    "name" TEXT NOT NULL,
    "category" TEXT,
    "url" TEXT NOT NULL,

    CONSTRAINT "emojis_pkey" PRIMARY KEY ("id")
);
