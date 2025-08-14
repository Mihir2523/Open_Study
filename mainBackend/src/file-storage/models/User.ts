import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  appwriteId: string;
  name: string;
  email: string;
  groups: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  appwriteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

export default model<IUser>('User', UserSchema);