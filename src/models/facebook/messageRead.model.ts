import { string } from 'joi';
import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IMessageRead {
  _id?: string;
  threadId?: string;
  pageId?: string;
  senderId?: string;
  userId?: string;
  isRead?: boolean;
}

const MessageRead = new Schema(
  {
    threadId: String,
    userId: String,
    pageId: String,
    senderId: String,
    isRead: Boolean,
  },
  { timestamps: true, id: true }
);

// Model name => collection
export default mongoose.model('MessageRead', MessageRead, 'message_reads');
