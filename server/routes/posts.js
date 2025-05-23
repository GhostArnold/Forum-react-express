import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { createPost } from '../controllers/posts.js';
import { getAll } from '../controllers/posts.js';
const router = new Router();

// Создание поста
router.post('/', checkAuth, createPost);
// Получение постов
router.get('/', getAll);
export default router;
