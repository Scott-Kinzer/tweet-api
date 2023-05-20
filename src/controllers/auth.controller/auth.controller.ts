import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { generateEmailToken } from '../../helpers/generateTokenValue';
import { AUTH_TOKEN_EXPIRATION, EMAIL_TOKEN_EXPIRATION_MINUTES, TokenType } from '../../constants';
import { removePrevTokens } from '../../sevices/token.service';
import { generateAuthToken } from '../../helpers/generateAuthJwtToken';
import { sendEmail } from '../../sevices/send.email.service';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  const emailToken = generateEmailToken();
  const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

  try {
    await removePrevTokens(email, TokenType.EMAIL);

    const createdToken = await prisma.token.create({
      data: {
        type: TokenType.EMAIL,
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email }
          }
        }
      }
    });

    await sendEmail(email, createdToken.emailToken);

    res.json({ mes: `Code sended to ${email}` });
  } catch (error) {
    res.status(400).json({ error: 'Something wrong happened' });
  }
};

export const auth = async (req: Request, res: Response) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken
    },
    include: {
      user: true
    }
  });

  if (!dbEmailToken || dbEmailToken.expiration < new Date()) {
    return res.sendStatus(401).json({ error: 'Token is expired' });
  }

  if (dbEmailToken.user.email !== email) {
    return res.sendStatus(401).json({ error: 'Wrong token' });
  }

  const expiration = new Date(new Date().getTime() + AUTH_TOKEN_EXPIRATION * 60 * 1000);

  const jwtToken = generateAuthToken(dbEmailToken.user.id);

  await removePrevTokens(email, TokenType.EMAIL);
  await removePrevTokens(email, TokenType.API);

  const apiToken = await prisma.token.create({
    data: {
      type: 'API',
      emailToken: jwtToken,
      expiration,
      user: {
        connect: {
          id: dbEmailToken.user.id
        }
      }
    }
  });

  return res.json({ token: apiToken.emailToken });
};
