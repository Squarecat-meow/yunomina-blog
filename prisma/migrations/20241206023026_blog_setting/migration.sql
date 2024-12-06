-- CreateTable
CREATE TABLE "blogSetting" (
    "settingId" SERIAL NOT NULL,
    "emojiAddress" TEXT,

    CONSTRAINT "blogSetting_pkey" PRIMARY KEY ("settingId")
);
