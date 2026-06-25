import { Router } from 'express';
import { register, login, refresh } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../validations/auth.validations';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);

export default router;