-- AlterTable
ALTER TABLE "quote_items" ADD COLUMN     "richDescription" TEXT;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "templateType" TEXT NOT NULL DEFAULT 'simple';
