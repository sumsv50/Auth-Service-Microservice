import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

export interface ITemplateComment {
    _id?: string,
    createdBy?: String,
    title?: String,
    comment?: String,
    image?: String,
}

const TemplateComment = new Schema({
    createdBy: Schema.Types.ObjectId,
    comment: String,
    title: String,
    image: String,
}, { timestamps: true, id: true });

TemplateComment.plugin(paginate);

interface TemplateCommentDocument extends Document, mongoose.Document { }


// Model name => collection
export default mongoose.model<
  TemplateCommentDocument,
  mongoose.PaginateModel<TemplateCommentDocument>
>('TemplateComment', TemplateComment, 'template-comments');