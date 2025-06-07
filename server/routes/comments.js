import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js';
import { createComment } from '../controllers/comments.js';
import { getPostComments } from '../controllers/comments.js';
const router = Router();

// Create Comment
router.post('/:id', checkAuth, createComment);
router.get('/comments/:id', getPostComments);
export default router;
