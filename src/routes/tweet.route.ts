import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { content, image, userId } = req.body;

  try {
    const createdTweet = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: +userId
      }
    });

    res.json(createdTweet);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Cannot create tweet' });
  }
});

router.get('/', async (req, res) => {
  const allTweets = await prisma.tweet.findMany();
  res.json(allTweets);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: +id
    }
  });
  res.json(tweet);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tweet.delete({
      where: {
        id: +id
      }
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: 'Cannot delete tweet' });
  }
});

export default router;
