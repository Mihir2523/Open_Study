"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group' }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Post', PostSchema);
