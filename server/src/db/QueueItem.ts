import { QueueItemStatus } from "../../generated/prisma/enums";
import { prisma } from "./prisma";
import { UserDB } from "./User";

export const QueueItemDB = {
  async getWaitingQueue() {
    return await prisma.queueItem.findMany({
      where: {
        NOT: {
          status: "deleted",
        },
      },
      select: {
        id: true,
        queuedAt: true,
        startedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        status: true,
      },
    });
  },

  async createNewQueueItem(email: string, name: string) {
    let user: any = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      console.log("creating new user");

      user = await UserDB.saveUser(name, email, "guest");
    }
    const userId = user.id;

    return await prisma.queueItem.create({
      data: {
        userId,
      },
    });
  },
  async changeStatus(id: number, status: QueueItemStatus) {
    const startedAt = new Date();
    return await prisma.queueItem.update({
      where: {
        id,
      },
      data: {
        status,
        startedAt: status === "meeting" ? startedAt : undefined,
      },
    });
  },
};
