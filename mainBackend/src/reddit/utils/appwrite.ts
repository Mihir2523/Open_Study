import { Client, Storage, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!);

export const storage = new Storage(client);
export const account = new Account(client);
export const bucketId = process.env.APPWRITE_BUCKET_ID!;

export const verifyToken = async (jwt: string) => {
  client.setJWT(jwt);
  return account.get();
};

export const uploadFile = async (file: Buffer, filename: string) => {
  const uint8array = new Uint8Array(file);
  const appwriteFile = new File([uint8array], filename);
  return storage.createFile(bucketId, 'unique()', appwriteFile);
};
