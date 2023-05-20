import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../../types';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
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
};

const getUsers = async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: +id
    },
    include: { tweets: true }
  });
  res.json(user);
};

const updateUser = async (req: Request, res: Response) => {
  const { image, name, bio } = req.body;
  const { id } = (req as AuthRequest).user;

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
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = (req as AuthRequest).user;

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
};

export { deleteUser, updateUser, getUser, getUsers, createUser };
