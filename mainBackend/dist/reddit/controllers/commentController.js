"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const user = req.user;
        const comment = await Comment_1.default.create({
            content,
            author: user._id,
            post: postId
        });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating comment' });
    }
};
exports.createComment = createComment;
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment_1.default.find({ post: postId })
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
};
exports.getComments = getComments;
