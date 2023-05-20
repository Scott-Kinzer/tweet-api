import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const removePrevTokens = async (email: string, tokenType: 'API' | 'EMAIL') => {
  const isTokenExists = await prisma.token.findFirst({
    where: {
      type: tokenType,
      user: {
        email
      }
    }
  });

  if (!!isTokenExists) {
    await prisma.token.deleteMany({
      where: {
        type: tokenType,
        user: {
          email
        }
      }
    });
  }
};
