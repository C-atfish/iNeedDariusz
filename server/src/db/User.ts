import { prisma } from "./prisma";

export const UserDB = {
  async getUser(id: number) {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  },
  async saveUser(name: string, email: string) {
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });
  },
};
