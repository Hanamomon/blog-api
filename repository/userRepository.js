import { prisma } from "../lib/prisma.js";

export async function createUser({ username, email, hash, salt }) {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      hash,
      salt
    },
    select: {
      username: true,
    },
  });

  return user;
}

export async function findUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });

  return user;
}

export async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      username: true,
    },
  });

  return user;
}

export async function findUserByUsername(username) {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive',
      },
    },
  });

  return user;
}

export async function assignRole({userId, role}) {
  const user = await prisma.user.update({
    data: {
      role,
    },
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });

  return user;
}