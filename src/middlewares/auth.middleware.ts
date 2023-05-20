import { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

const prisma = new PrismaClient();

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Authentication
  const authHeader = req.headers['authorization'];

  const jwtToken = authHeader?.split(' ')[1];

  if (!jwtToken) {
    return res.sendStatus(401);
  }

  try {
    // decode the jwt token
    jwt.verify(jwtToken, JWT_SECRET) as {
      userId: number;
    };
  } catch {
    return res.status(401).json({ error: 'API token expired' });
  }
  try {
    const dbToken = await prisma.token.findUnique({
      where: {
        emailToken: jwtToken
      },
      include: { user: true }
    });

    if (!dbToken) {
      return res.status(401).json({ error: 'Token not valid' });
    }

    (req as AuthRequest).user = dbToken.user;
  } catch (e) {
    return res.sendStatus(401);
  }

  next();
}
