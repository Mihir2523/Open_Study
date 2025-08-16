"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GroupSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
});
exports.default = (0, mongoose_1.model)('Group', GroupSchema);
