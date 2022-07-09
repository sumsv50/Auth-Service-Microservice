import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

export interface INotification {
  _id?: string,
  userId?: string,
  type?: string,
  isRead?: boolean,
  data?: object
}

const Notification = new Schema({
  userId: Schema.Types.ObjectId,
  type: String,
  isRead: { type: Boolean, default: false },
  data: Object
}, { timestamps: true, id: true });

Notification.plugin(paginate);

interface NotificationDocument extends Document, mongoose.Document { }


// Model name => collection
export default mongoose.model<
  NotificationDocument,
  mongoose.PaginateModel<NotificationDocument>
>('Notification', Notification, 'notifications') 