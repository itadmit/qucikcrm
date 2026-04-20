-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "signature" TEXT;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "signature" TEXT,
ADD COLUMN     "signedAt" TIMESTAMP(3);
