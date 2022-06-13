/*
  Warnings:

  - The `type` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "type",
ADD COLUMN     "type" "TRANSACTION_TYPE" NOT NULL DEFAULT E'TRANSFER';
