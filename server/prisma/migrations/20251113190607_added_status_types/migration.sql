-- CreateEnum
CREATE TYPE "QueueItemStatus" AS ENUM ('queued', 'meeting', 'deleted', 'completed');

-- AlterTable
ALTER TABLE "QueueItem" ADD COLUMN     "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "QueueItemStatus" NOT NULL DEFAULT 'queued';
