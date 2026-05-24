import { findPostComments, findSinglePostComment, createComment, updatePostComment, removePostComment } from "../repository/commentRepository.js";

export async function getComments(req, res) {
  const comments = await findPostComments(req.params.postId);

  res.status(200).json(comments);
}

export async function getCommentById(req, res) {
  const comment = await findSinglePostComment(req.params.postId, Number(req.params.commentId));

  res.status(200).json(comment);
}

export async function postComment(req, res) {
  const { userId, postId, content } = req.body;

  const comment = await createComment({ userId, postId, content });

  res.status(201).json(comment);
}

export async function putComment(req, res) {
  const { userId, postId, commentId, content } = req.body;

  const comment = await updatePostComment({ userId, postId, commentId, content });

  res.status(200).json(comment);
}

export async function deleteComment(req, res) {
  const { userId, postId, commentId } = req.body;

  const comment = await removePostComment({ userId, postId, commentId });

  res.status(204).json(comment);
}