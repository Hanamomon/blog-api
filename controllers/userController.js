import { findUserById, createUser, assignRole } from '../repository/userRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function postUser(req, res) {
  const { username, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const user = await createUser({ username, email, hash, salt });

  return res.status(201).json(user);
}

export async function logUser(req, res) {
  const user = req.user;
  const secret = process.env.JWT_SECRET;
  
  jwt.sign(user, secret, { expiresIn: '1d' }, (err, token) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    
    res.status(200).json(token);
  });
}

export async function patchRole(req, res) {
  const userId = req.user.id;
  const { role } = req.body;
  
  const user = await assignRole({ userId, role });

  res.status(200).json(user);
}
