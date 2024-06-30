import {Router} from 'express';
import AuthController from "../../controllers/authController";
import authenticateMiddleware from "@middlewares/authenticateMiddleware";
import authController from "../../controllers/authController";

const router = Router();

const controller = new AuthController();

// No Login Required Routes
router.post('/login', controller.login);


// Login Required Routes
router.post('/logout', authenticateMiddleware, controller.logout)


export default router;