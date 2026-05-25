import { findPosts, findSinglePost, createPost, updatePost, setPublish, removePost } from "../repository/postRepository.js";

export async function getPosts(req, res) {
  const posts = await findPosts();

  res.status(200).json(posts);
}

export async function getPostById(req, res) {
  const { postId } = req.params;
  const post = await findSinglePost(postId);

  res.status(200).json(post);
}

export async function postPost(req, res) {
  const userId = req.user.id;
  const { title, content } = req.body;

  const post = await createPost({ userId, title, content });

  res.status(201).json(post);
}

export async function putPost(req, res) {
  const userId = req.user.id;
  const { postId } = req.params;
  const { title, content } = req.body;
  const post = await updatePost({ userId, postId, title, content });

  res.status(200).json(post);
}

export async function patchPostPublish(req, res) {
  const userId = req.user.id;
  const { postId } = req.params;
  const { published } = req.body;

  const post = await setPublish({ userId, postId, published });

  res.status(200).json(post);
}

export async function deletePost(req, res) {
  const userId = req.user.id;
  const { postId } = req.params;

  const post = await removePost(userId, postId);

  res.status(204).json(post);
}