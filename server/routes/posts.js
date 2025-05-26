import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { createPost } from '../controllers/posts.js';
import { getAll } from '../controllers/posts.js';
import { getById } from '../controllers/posts.js';
import { getMyPosts } from '../controllers/posts.js';
import { removePost } from '../controllers/posts.js';

const router = new Router();

// Создание поста
router.post('/', checkAuth, createPost);
// Получение постов
router.get('/', getAll);

// Получение по id
router.get('/:id', getById);

// Получение моих статей
router.get('/user/me', checkAuth, getMyPosts);

// Удаление статьи
router.delete('/:id', removePost);

export default router;
