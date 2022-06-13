-- CreateTable
CREATE TABLE "PostTransaction" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "type" "TRANSACTION_TYPE" NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "TRANSACTION_STATUS" NOT NULL,
    "userId" TEXT NOT NULL,
    "receiverDetails" JSONB NOT NULL,
    "peakHours" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PostTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTransaction_uid_key" ON "PostTransaction"("uid");
