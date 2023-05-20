import { Router } from 'express';
import { createTweet, deleteTweet, getTweet, getTweets } from '../controllers/tweet.controller/tweet.controller';

const router = Router();

router.post('/', createTweet);

router.get('/', getTweets);

router.get('/:id', getTweet);

router.delete('/', deleteTweet);

export default router;
