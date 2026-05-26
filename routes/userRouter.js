import { Router } from "express";
import { postUser, logUser, patchRole } from "../controllers/userController.js";
import { passport } from "../lib/passport.js";
import { validatorMiddleware, validateSignUp, validateLogin, validateRole } from "../middlewares/validationMiddleware.js";

const router = Router();

router.post('/sign-up', validateSignUp, validatorMiddleware, postUser);

router.post('/login', validateLogin, validatorMiddleware,
  (req,res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).json({ errors: { password: { msg: 'Incorrect password.'} } }); }

      req.user = user;
      next();
    })(req, res, next);
  }
  , logUser);

router.patch('/', passport.authenticate('jwt', { session: false }), validateRole, validatorMiddleware, patchRole);

export default router;