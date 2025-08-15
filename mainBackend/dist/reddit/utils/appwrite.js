"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.verifyToken = exports.bucketId = exports.account = exports.storage = void 0;
const appwrite_1 = require("appwrite");
const client = new appwrite_1.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
exports.storage = new appwrite_1.Storage(client);
exports.account = new appwrite_1.Account(client);
exports.bucketId = process.env.APPWRITE_BUCKET_ID;
const verifyToken = async (jwt) => {
    client.setJWT(jwt);
    return exports.account.get();
};
exports.verifyToken = verifyToken;
const uploadFile = async (file, filename) => {
    const uint8array = new Uint8Array(file);
    const appwriteFile = new File([uint8array], filename);
    return exports.storage.createFile(exports.bucketId, 'unique()', appwriteFile);
};
exports.uploadFile = uploadFile;
