-- CreateTable
CREATE TABLE "public"."ExampleCoverLetter" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ExampleCoverLetter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ExampleCoverLetter" ADD CONSTRAINT "ExampleCoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
