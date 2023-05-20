import { Router } from 'express';
import { auth, login } from '../controllers/auth.controller/auth.controller';

const router = Router();

router.post('/login', login);

router.post('/auth', auth);

export default router;
