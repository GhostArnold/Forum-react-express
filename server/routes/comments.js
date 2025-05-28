import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { createComment } from '../controllers/comments.js';
const router = Router();

// Create Comment
router.post('/:id', checkAuth, createComment);

export default router;
