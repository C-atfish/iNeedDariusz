import { prisma } from "./prisma";

export const UserDB = {
  async getUser(id: string, email: string) {
    return await prisma.user.findFirst({
      where: {
        external_id: id,
        email: email,
      },
    });
  },
  async saveUser(name: string, email: string, external_id: string) {
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
        external_id,
      },
    });
  },
};
