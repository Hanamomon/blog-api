import { findPostComments, findSinglePostComment, createComment, updatePostComment, removePostComment } from "../repository/commentRepository.js";
import { matchedData } from "express-validator";

export async function getComments(req, res) {
  const { postId } = matchedData(req);
  const comments = await findPostComments(postId);

  res.status(200).json(comments);
}

export async function getCommentById(req, res) {
  const { postId, commentId } = matchedData(req);
  const comment = await findSinglePostComment(postId, Number(commentId));

  res.status(200).json(comment);
}

export async function postComment(req, res) {
  const userId = req.user.id;
  const { postId, content } = matchedData(req);

  const comment = await createComment({ userId, postId, content });

  res.status(201).json(comment);
}

export async function putComment(req, res) {
  const userId = req.user.id;
  const { postId, commentId, content } = matchedData(req);
  const commentIdInt = Number(commentId);

  const comment = await updatePostComment({ userId, postId, commentId: commentIdInt, content });

  res.status(200).json(comment);
}

export async function deleteComment(req, res) {
  const userId = req.user.id;
  const { postId, commentId } = matchedData(req);
  const commentIdInt = Number(commentId);

  const comment = await removePostComment({ userId, postId, commentId: commentIdInt });

  res.status(204).json(comment);
}