"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    appwriteId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    groups: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Group' }]
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
