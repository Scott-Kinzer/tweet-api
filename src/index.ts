import express from 'express';
import userRouter from './routes/user.route';
import tweetRouter from './routes/tweet.route';
import authRouter from './routes/auth.route';
import { authenticateToken } from './middlewares/auth.middleware';

const app = express();
app.use(express.json());
app.use('/user', authenticateToken, userRouter);
app.use('/tweet', authenticateToken, tweetRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is ready on port 3000');
});
