import { Schema, model, Document } from 'mongoose';

interface IGroup extends Document {
  name: string;
  description: string;
  admin: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default model<IGroup>('Group', GroupSchema);