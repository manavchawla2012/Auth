import {Router} from 'express';
import UserController from '../../controllers/userController';
import authenticateMiddleware from "@middlewares/authenticateMiddleware";

const router = Router();

const userController = new UserController();

// Login Required Routes
router.post('/', authenticateMiddleware, userController.createUser);

export default router;
