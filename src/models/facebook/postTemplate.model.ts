import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

export interface IPostTemplate {
  _id?: string,
  createdBy?: string,
  title?: string,
  content?: string,
}

const PostTemplate = new Schema({
  createdBy: Schema.Types.ObjectId,
  title: String,
  content: String,
}, { timestamps: true, id: true });

PostTemplate.plugin(paginate);

interface PostTemplateDocument extends Document, mongoose.Document { }

// Model name => collection
export default mongoose.model<
PostTemplateDocument,
  mongoose.PaginateModel<PostTemplateDocument>
>('PostTemplate', PostTemplate, 'post_templates');