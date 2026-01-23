-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "instructions" JSONB,
ADD COLUMN     "introText" TEXT,
ADD COLUMN     "proTips" JSONB;
