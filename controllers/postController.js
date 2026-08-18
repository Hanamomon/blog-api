import {
  findPosts,
  findSinglePost,
  findUserPosts,
  createPost,
  updatePost,
  setPublish,
  removePost,
} from "../repository/postRepository.js";
import { matchedData } from "express-validator";

export async function getPosts(req, res) {
  const posts = await findPosts();

  res.status(200).json(posts);
}

export async function getPostById(req, res) {
  const { postId } = matchedData(req);
  const post = await findSinglePost(postId);

  res.status(200).json(post);
}

export async function getAuthorPosts(req, res) {
  const userId = req.user.id;
  const posts = await findUserPosts(userId);

  res.status(200).json(posts);
}

export async function postPost(req, res) {
  const userId = req.user.id;
  const { title, content } = matchedData(req);
  const post = await createPost({ userId, title, content });

  res.status(201).json(post);
}

export async function putPost(req, res) {
  const userId = req.user.id;
  const { postId, title, content } = matchedData(req);
  const post = await updatePost({ userId, postId, title, content });

  res.status(200).json(post);
}

export async function patchPostPublish(req, res) {
  const userId = req.user.id;
  const { postId, published } = matchedData(req);

  const post = await setPublish({ userId, postId, published });

  res.status(200).json(post);
}

export async function deletePost(req, res) {
  const userId = req.user.id;
  const { postId } = matchedData(req);

  const post = await removePost(userId, postId);

  res.status(204).json(post);
}
