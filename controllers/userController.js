import { findUserById, createUser, assignRole } from '../repository/userRepository.js';

export async function postUser(req, res) {
  const { username, email, hash, salt } = req.body;

  const user = await createUser({ username, email, hash, salt });

  res.status(200).json(user);
}

export async function patchRole(req, res) {
  const { userId, role } = req.body;
  
  const user = await assignRole({ userId, role });

  res.status(200).json(user);
}
