import { Router } from "express";
import { getComments, getCommentById, postComment, putComment, deleteComment } from "../controllers/commentController.js";
import { passport } from "../lib/passport.js";

const router = Router({ mergeParams: true });

router.get('/', getComments);

router.get('/:commentId', getCommentById);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', postComment);

router.put('/:commentId', putComment);

router.delete('/:commentId', deleteComment);

export default router;