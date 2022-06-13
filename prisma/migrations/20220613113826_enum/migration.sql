/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TRANSACTION_STATUS" AS ENUM ('PENDING', 'SUCCESS', 'DECLINED');

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdAt",
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;
