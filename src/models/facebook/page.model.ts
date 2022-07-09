import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IPage {
  _id?: string;
  pageId?: string;
  quickReplies?: any;
  autoReplies?: any;
}

const Page = new Schema(
  {
    _id: String,
    pageId: String,
    senderId: String,
    quickReplies: [
        {type: Schema.Types.ObjectId, ref: 'QuickReply'}
    ],
    autoReplies: [
        {type: Schema.Types.ObjectId, ref: 'AutoReply'}
    ],
  },
  { timestamps: true, id: true }
);

// Model name => collection
export default mongoose.model('Page', Page, 'pages');
