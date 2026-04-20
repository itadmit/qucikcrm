-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "clientId" TEXT;

-- CreateIndex
CREATE INDEX "payments_clientId_idx" ON "payments"("clientId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
