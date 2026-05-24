import { Router } from "express";
import { postUser, patchRole } from "../controllers/userController.js";

const router = Router();

router.post('/sign-up', postUser);

router.patch('/:userId', patchRole);

export default router;