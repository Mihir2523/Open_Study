import { Request, Response } from 'express';
import Group from '../models/Group';
import User from '../models/User';

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const user = req.user as User;

    const group = await Group.create({
      name,
      description,
      admin: user._id,
      members: [user._id]
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { groups: group._id }
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error creating group' });
  }
};

export const joinGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const user = req.user as User;

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: user._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(user._id, {
      $addToSet: { groups: groupId }
    });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Error joining group' });
  }
};