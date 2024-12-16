-- CreateTable
CREATE TABLE "reply" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT,
    "postId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "replyId" INTEGER,

    CONSTRAINT "reply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reply" ADD CONSTRAINT "reply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
