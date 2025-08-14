import express from 'express';
import { createGroup, joinGroup } from '../controllers/groupController';
import { authenticate } from '../utils/authMiddleware';

const router = express.Router();

router.post('/', authenticate, createGroup);
router.post('/:groupId/join', authenticate, joinGroup);

export default router;