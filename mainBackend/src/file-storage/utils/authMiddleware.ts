import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './appwrite';
import User from '../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const { $id, name, email } = await verifyToken(token);
    let user = await User.findOne({ appwriteId: $id });

    if (!user) {
      user = await User.create({ appwriteId: $id, name, email });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};