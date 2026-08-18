import { prisma } from "../lib/prisma.js";

const postSelect = {
  publicId: true,
  title: true,
  content: true,
  postedAt: true,
};

export async function findPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: postSelect,
  });
  
  return posts;
}

export async function findUserPosts(userId) {
  const users = await prisma.user.findMany({
    where: {
      id: userId,
      role: "AUTHOR",
    },
    select: {
      posts: {
        select: {
          ...postSelect,
          published: true,
        },
      },
    },
  });

  return users[0].posts;
}

export async function findSingleUserPost(postId, userId) {
  const post = await prisma.post.findUnique({
    where: {
      publicId: postId,
      userId,
    },
    select: postSelect,
  });

  return post; 
}
// Add select statemtns to filter and clean up query results from sensitive data
export async function findSinglePost(postId) {
  const post = await prisma.post.findUnique({
    where: {
      publicId: postId,
    },
    select: postSelect,
  });

  return post;
}

export async function createPost({ userId, title, content}) {
  const post = await prisma.post.create({
    data: {
      userId,
      title,
      content,
    },
    select: postSelect,
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
      publicId: postId,
      user: {
        id: userId,
        role: "AUTHOR",
      },
    },
    select: postSelect,
  });

  return post;
}

export async function setPublish({ userId, postId, published }) {
  const result = await prisma.post.update({
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
    select: postSelect,
  });

  return result;
}

export async function removePost(userId, postId) {
  const post = await prisma.post.delete({
    where: {
      publicId: postId,
      user: {
        id: userId,
        role: "AUTHOR",
      },
    },
    select: postSelect,
  });

  return post;
}