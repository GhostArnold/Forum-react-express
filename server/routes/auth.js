import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.js';
import { checkAuth } from '../middlewares/checkAuth.js';
const router = new Router();

// Register
// http://localhost:3002/api/auth/register
router.post('/register', register);

// Login
// http://localhost:3002/api/auth/autorization
router.post('/login', login);

// Get me
// http://localhost:3002/api/auth/me
router.get('/get', checkAuth, getMe);

export default router;
