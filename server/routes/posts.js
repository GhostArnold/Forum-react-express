import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { createPost } from '../controllers/posts';
const router = new Router();

router.post('/', checkAuth, createPost);

export default router;
