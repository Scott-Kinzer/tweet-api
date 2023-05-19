import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, name, userName, bio, image } = req.body;

  try {
    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        userName,
        bio,
        image
      }
    });

    res.json(createdUser);
  } catch (error) {
    res.status(400).json({ error: 'Cannot create user' });
  }
});

router.get('/', async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: +id
    }
  });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { image, name, bio } = req.body;

  try {
    const result = await prisma.user.update({
      where: {
        id: +id
      },
      data: {
        bio,
        name,
        image
      }
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Cannot update user' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: {
        id: +id
      }
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({ error: 'Cannot delete user' });
  }
});

export default router;
