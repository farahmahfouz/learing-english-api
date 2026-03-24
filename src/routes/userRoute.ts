import { Router } from 'express';
import { getMe, getOneUser, login, signup } from '../controllers/userController';
import { auth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(auth);

router.get('/me', getMe, getOneUser);
router.get('/:id', getOneUser);


export default router;
