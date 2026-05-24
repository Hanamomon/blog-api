import { Router } from "express";
import commentRouter from './commentRouter.js';
import { getPosts, getPostById, postPost, putPost, patchPostPublish, deletePost } from "../controllers/postController.js";

const router = Router();

router.get('/', getPosts);

router.use('/:postId/comments', commentRouter);

router.get('/:postId', getPostById);

router.post('/', postPost);

router.put('/:postId', putPost);

router.patch('/:postId', patchPostPublish);

router.delete('/:postId', deletePost);

export default router;