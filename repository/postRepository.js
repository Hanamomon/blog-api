import { prisma } from "../lib/prisma.js";

export async function findPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  
  return posts;
}

export async function findUserPosts(userId) {
  const posts = await prisma.user.findMany({
    where: {
      id: userId,
      role: "AUTHOR",
    },
    include: {
      posts: true,
    }
  });

  return posts;
}

export async function findSinglePost(postId) {
  const post = await prisma.post.findUnique({
    where: {
      publicId: postId,
    },
  });

  return post;
}

export async function createPost({ userId, title, content}) {
  const post = await prisma.post.create({
    data: {
      userId,
      title,
      content,
    }
  });

  return post;
}

export async function updatePost({ userId, postId, title, content}) {
  const post = await prisma.post.update({
    data: {
      title,
      content,
    },
    where: {
      userId,
      publicId: postId,
    }
  });

  return post;
}

export async function setPublish({ userId, postId, published }) {
  const result = await prisma.post.updateMany({
    data: {
      published,
    },
    where: {
      publicId: postId,
      user: {
        id: userId,
        role: "AUTHOR",
      },
    },
  });

  return result;
}

export async function removePost(userId, postId) {
  const post = await prisma.post.delete({
    where: {
      userId,
      publicId: postId,
    },
  });

  return post;
}