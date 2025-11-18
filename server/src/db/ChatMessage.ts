import { prisma } from "./prisma";

export const ChatMessageDB = {
  async getMessages() {
    return await prisma.chatMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        from: true,
        text: true,
        createdAt: true,
      },
    });
  },
  async saveMessage(from: string, text: string) {
    return await prisma.chatMessage.create({
      data: {
        from,
        text,
      },
    });
  },
};
