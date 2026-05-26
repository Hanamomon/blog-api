import { prisma } from "../lib/prisma.js";

const commentSelect = {
  id: true,
  content: true,
  postedAt: true,
  user: {
    select: {
      username: true,
      id: true,
    }
  }
}

export async function findPostComments(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      post: {
        publicId: postId,
      }
    },
    select: commentSelect,
  });
  
  return comments;
}

export async function findSinglePostComment(postId, commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      post: {
        publicId: postId,
      },
    },
    select: commentSelect,
  });

  return comment;
}

export async function findUserComment(userId, commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      userId,
    },
    select: commentSelect,
  });

  return comment; 
}

export async function createComment({ userId, postId, content }) {
  const comment = await prisma.comment.create({
    data: {
      content,
      post: {
        connect: {
          publicId: postId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: commentSelect,
  });

  return comment;
}

export async function updatePostComment({ userId, postId, commentId, content }) {
  const comment = await prisma.comment.update({
    data: {
      content,
    },
    where: {
      id: commentId,
      userId,
      post: {
        publicId: postId,
      },
    },
    select: commentSelect,
  });

  return comment;
}

export async function findCommentRelationInfo(commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      userId: true,
      post: {
        select: {
          userId: true,
        },
      },
    },
  });

  return comment;
}

export async function removePostComment(commentId) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId,
    },
    select: commentSelect,
  });

  return comment;
}