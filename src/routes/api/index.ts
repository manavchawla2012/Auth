import {Router} from 'express';
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use('/user', userRoutes)
router.use('/auth', authRoutes)

export default router;