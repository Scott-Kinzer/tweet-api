import { Router } from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller/user.controller';

const router = Router();

router.post('/', createUser);

router.get('/', getUsers);

router.get('/:id', getUser);

router.put('/', updateUser);

router.delete('/', deleteUser);

export default router;
