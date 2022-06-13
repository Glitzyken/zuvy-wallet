/*
  Warnings:

  - You are about to drop the column `walletId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_walletId_fkey";

-- DropIndex
DROP INDEX "User_walletId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "walletId";

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
