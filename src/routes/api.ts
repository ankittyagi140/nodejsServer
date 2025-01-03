import express from "express";
import AuthController from "../controllers/AuthController";
import { registerValidation } from "../validations/authValidation";
import { authenticateJwtToken } from "../middleware/authMiddleware";
import UsersController from "../controllers/UsersController";

const router = express.Router();

router.post('/auth/register', registerValidation(), AuthController.register);
router.post('/auth/login',registerValidation(),AuthController.login)
router.get('/get/users',authenticateJwtToken,UsersController.getUser)
router.post('/auth/logout',authenticateJwtToken,AuthController.logout)


export default router;