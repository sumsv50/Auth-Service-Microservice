import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

export interface IFbPost {
  _id?: string,
  createdBy?: string,
  fbPostIds?: Array<string>,
  groups?: Array<any>,
  content?: string,
  images?: Array<string>,
  product?: String
  status?: String,
  schedulePostTime?: Number
}

const FbPost = new Schema({
  createdBy: Schema.Types.ObjectId,
  fbPostIds: [String],
  groups: [{
    id: String,
    name: String,
    privacy: String 
  }],
  content: String,
  images: [String],
  product : {type: Schema.Types.ObjectId, ref: 'Product'},
  status: String,
  schedulePostTime: Number
}, { timestamps: true, id: true });

FbPost.plugin(paginate);

interface FbPostDocument extends Document, mongoose.Document { }

// Model name => collection
export default mongoose.model<
FbPostDocument,
  mongoose.PaginateModel<FbPostDocument>
>('FbPost', FbPost, 'fb_posts');