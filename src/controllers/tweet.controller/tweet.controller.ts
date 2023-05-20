import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../../types';

const prisma = new PrismaClient();

const createTweet = async (req: Request, res: Response) => {
  const { content, image } = req.body;
  const { id } = (req as AuthRequest).user;

  try {
    const createdTweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: +id
      }
    });

    res.json(createdTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Cannot create tweet' });
  }
};

const getTweets = async (req: Request, res: Response) => {
  const allTweets = await prisma.tweet.findMany({
    include: { user: { select: { id: true, name: true, userName: true, image: true } } }
  });
  res.json(allTweets);
};

const getTweet = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: +id
      },
      include: { user: true }
    });
    res.json(tweet);
  } catch (error) {
    res.status(400).json({ error: 'Cannot get tweets' });
  }
};

const deleteTweet = async (req: Request, res: Response) => {
  const { id } = (req as AuthRequest).user;
  const { tweetId } = req.body;

  try {
    await prisma.tweet.deleteMany({
      where: {
        id: +tweetId,
        userId: +id
      }
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: 'Cannot delete tweet' });
  }
};

export { deleteTweet, getTweet, createTweet, getTweets };
