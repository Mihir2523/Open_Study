"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = exports.createPost = void 0;
const Post_js_1 = __importDefault(require("../models/Post.js"));
const appwrite_1 = require("../utils/appwrite");
const createPost = async (req, res) => {
    try {
        const { title, content, groupId } = req.body;
        const user = req.user;
        let imageUrl;
        if (req.file) {
            const file = await (0, appwrite_1.uploadFile)(req.file.buffer, req.file.originalname);
            imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
        }
        const post = await Post_js_1.default.create({
            title,
            content,
            imageUrl,
            author: user._id,
            group: groupId || null
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const { groupId } = req.query;
        const filter = groupId ? { group: groupId } : {};
        const posts = await Post_js_1.default.find(filter)
            .populate('author', 'name')
            .populate('group', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};
exports.getPosts = getPosts;
