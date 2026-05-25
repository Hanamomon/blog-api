import { Router } from "express";
import { getComments, getCommentById, postComment, putComment, deleteComment } from "../controllers/commentController.js";
import { passport } from "../lib/passport.js";
import { validatorMiddleware, validatePostId, validatePostCommentId, validateAddComment, validateUserComment, validateEditComment } from "../middlewares/validationMiddleware.js";

const router = Router({ mergeParams: true });

router.get('/', validatePostId, validatorMiddleware, getComments);

router.get('/:commentId', validatePostCommentId, validatorMiddleware, getCommentById);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', validateAddComment, validatorMiddleware, postComment);

router.put('/:commentId', validateEditComment, validatorMiddleware, putComment);

router.delete('/:commentId', validateUserComment, validatorMiddleware, deleteComment);

export default router;