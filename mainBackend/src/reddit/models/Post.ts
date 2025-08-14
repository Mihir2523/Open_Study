import { Schema, model, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  author: Schema.Types.ObjectId;
  group?: Schema.Types.ObjectId;
}

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' }
}, { timestamps: true });

export default model<IPost>('Post', PostSchema);