-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_walletId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "walletId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
