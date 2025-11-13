import { prisma } from "./prisma";

export const UserDB = {
  async getUser(id: string) {
    return await prisma.user.findUnique({
      where: {
        external_id: id,
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
