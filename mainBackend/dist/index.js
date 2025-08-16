"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("Environment variables:", {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
});
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const postRoutes_1 = __importDefault(require("./reddit/routes/postRoutes"));
const groupRoutes_1 = __importDefault(require("./reddit/routes/groupRoutes"));
const commentRoutes_1 = __importDefault(require("./reddit/routes/commentRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use('/api/posts', postRoutes_1.default);
app.use('/api/groups', groupRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
