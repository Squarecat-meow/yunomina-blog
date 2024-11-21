-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userId_key" ON "user"("userId");
