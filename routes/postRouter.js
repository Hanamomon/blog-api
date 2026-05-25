import { Router } from "express";
import commentRouter from './commentRouter.js';
import { getPosts, getPostById, postPost, putPost, patchPostPublish, deletePost } from "../controllers/postController.js";
import { passport } from "../lib/passport.js";
import { validatorMiddleware, validatePostId, validateAddPost, validateUserPost, validateEditPost, validatePublishPost } from "../middlewares/validationMiddleware.js";
import { isAuthor } from "../middlewares/authorMiddleware.js";
const router = Router();

router.get('/', getPosts);

router.use('/:postId/comments', commentRouter);

router.get('/:postId', validatePostId, validatorMiddleware, getPostById);

router.use(passport.authenticate('jwt', { session: false }), isAuthor);

router.post('/', validateAddPost, validatorMiddleware, postPost);

router.put('/:postId',validateEditPost, validatorMiddleware, putPost);

router.patch('/:postId', validatePublishPost, validatorMiddleware, patchPostPublish);

router.delete('/:postId', validateUserPost, validatorMiddleware, deletePost);

export default router;