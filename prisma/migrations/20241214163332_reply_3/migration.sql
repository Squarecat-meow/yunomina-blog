/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `reply` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reply_postId_key" ON "reply"("postId");
