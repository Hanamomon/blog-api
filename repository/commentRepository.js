import { prisma } from "../lib/prisma.js";

export async function findPostComments(postId) {
  const comments = await prisma.comment.findMany({
    where: {
      post: {
        publicId: postId,
      }
    },
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
  });

  return comment;
}

export async function findUserComment(userId, commentId) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      userId,
    },
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
  });

  return comment;
}

export async function removePostComment({ userId, postId, commentId }) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId,
      post: {
        publicId: postId,
      },
      userId,
    },
  });

  return comment;
}