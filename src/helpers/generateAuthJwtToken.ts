import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

export function generateAuthToken(userId: number): string {
  const jwtPayload = { userId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: 'HS256',
    noTimestamp: true,
    expiresIn: '12h'
  });
}
