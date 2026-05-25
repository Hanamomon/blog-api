import { Router } from "express";
import { postUser, logUser, patchRole } from "../controllers/userController.js";
import { passport } from "../lib/passport.js";

const router = Router();

router.post('/sign-up', postUser);

router.post('/login', passport.authenticate('local', { session: false }), logUser);

router.patch('/', passport.authenticate('jwt', { session: false }), validateRole, validatorMiddleware, patchRole);

export default router;