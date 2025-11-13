import { prisma } from "./prisma";

export const QueueItemDB = {
  async getWaitingQueue() {
    return await prisma.queueItem.findMany({
      where: {
        status: "queued",
      },
      select: {
        id: true,
        queuedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async createNewQueueItem(userId: number) {
    return await prisma.queueItem.create({
      data: {
        userId,
      },
    });
  },
};
