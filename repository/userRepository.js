import { prisma } from "../lib/prisma.js";

export async function createUser({ username, email, hash, salt }) {
  const user = await prisma.user.create({
    data: {
      username,
      email,
      hash,
      salt
    },
  });

  return user;
}

export async function findUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

export async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username,
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
  });

  return user;
}