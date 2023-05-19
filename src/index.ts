import express from 'express';
import userRouter from './routes/user.route';
import tweetRouter from './routes/tweet.route';

const app = express();
app.use(express.json());
app.use('/user', userRouter);
app.use('/tweet', tweetRouter);

app.listen(3000, () => {
  console.log('Server is ready on port 3000');
});
