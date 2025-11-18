import { prisma } from "./prisma";

export const ChatMessageDB = {
  async getMessages() {
    const messages = await prisma.chatMessage.findMany({
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
    const serialized = messages.map((m) => ({
      id: m.id,
      user: m.from,
      text: m.text,
      createdAt: m.createdAt,
    }));
    return serialized;
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
