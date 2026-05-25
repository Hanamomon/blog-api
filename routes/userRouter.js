import { Router } from "express";
import { postUser, logUser, patchRole } from "../controllers/userController.js";
import { passport } from "../lib/passport.js";
import { validatorMiddleware, validateSignUp, validateLogin, validateRole } from "../middlewares/validationMiddleware.js";

const router = Router();

router.post('/sign-up', validateSignUp, validatorMiddleware, postUser);

router.post('/login', validateLogin, validatorMiddleware, passport.authenticate('local', { session: false }), logUser);

router.patch('/', passport.authenticate('jwt', { session: false }), validateRole, validatorMiddleware, patchRole);

export default router;