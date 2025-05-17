import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { createPost } from '../controllers/posts.js';
const router = new Router();

router.post('/', checkAuth, createPost);

export default router;
