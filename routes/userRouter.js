import { Router } from "express";
import { postUser, logUser, patchRole } from "../controllers/userController.js";
import { passport } from "../lib/passport.js";

const router = Router();

router.post('/sign-up', postUser);

router.post('/login', passport.authenticate('local', { session: false, failureRedirect: '/login' }), logUser);

router.patch('/:userId', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), patchRole);

export default router;