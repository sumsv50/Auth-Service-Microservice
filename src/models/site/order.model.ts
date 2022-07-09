import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

export interface IOrder {
  _id?: string,
  products?: [{
    product: string,
    quantity: number
  }],
  customer_fb_id?: string, 
  customer_id?: string,
  thread_id?: string,
  customer_name?: string,
  delivery_date?: Date,
  product_total?: number,
  delivery_total?: number,
  discount?: number,
  total_payment?: number,
  note?: string,
  state?: number,
  ec_site?: number,
  createdBy?: string,
}

const Order = new Schema({
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: Number,
  }],
  customer_fb_id: String,
  customer_id: String,
  thread_id: String,
  customer_name: String,
  delivery_date: Date,
  product_total: String,
  delivery_total: Number,
  discount: Number,
  total_payment: Number,
  note: String,
  state: Number,
  ec_site: Number,
  createdBy: Schema.Types.ObjectId
}, { timestamps: true, id: true });

Order.plugin(paginate);

interface OrderDocument extends Document, mongoose.Document { }


// Model name => collection
export default mongoose.model<
  OrderDocument,
  mongoose.PaginateModel<OrderDocument>
>('Order', Order, 'orders') 