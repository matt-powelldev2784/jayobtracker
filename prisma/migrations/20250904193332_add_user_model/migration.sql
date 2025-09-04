-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "website" TEXT,
    "jobField" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
