import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IQuickReply {
  _id?: string,
  name?: string,
  text?: string,
  email?: string,
  pageId?: string, 
  samples?: any,
  ids?: string[],
}

const QuickReply = new Schema({
  name: String,
  pageId: String,
  text: String,
  samples: [
      {
        content_type: String,
        title: String,
        payload: String,
        image_url: String
      }
  ]
}, { timestamps: true, id: true });

// Model name => collection
export default mongoose.model('QuickReply', QuickReply, 'quick_replies');