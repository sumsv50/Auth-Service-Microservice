import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

export interface IProduct {
  _id?: string,
  createdBy?: String,
  name?: String,
  sku?: String,
  weight?: Number,
  height?: Number,
  width?: Number,
  length?: Number,
  dimensionUnit?: String,
  weightUnit?: String,
  stockAvailable?: Array<any>,
  importPrice?: Number,
  exportPrice?: Number,
  type?: String,
  description?: String,
  branch?: String,
  inventoryNumber?: Number,
  image?: String,
  images?: Array<String>,
  isAllowSell?: Boolean,
}

const Product = new Schema({
  createdBy: Schema.Types.ObjectId,
  name: String,
  sku: String,
  weight: Number,
  height: Number,
  width: Number,
  length: Number,
  dimensionUnit: String,
  weightUnit: String,
  stockAvailable: [{
    ecSite: String,
    quantity: Number,
    availableQuantity: Number
  }],
  importPrice: Number,
  exportPrice: Number,
  type: String,
  description: String,
  branch: String,
  inventoryNumber: Number,
  image: String,
  images: [String],
  isAllowSell: { type: Boolean, default: true },
}, { timestamps: true, id: true });

Product.plugin(paginate);

interface ProductDocument extends Document, mongoose.Document { }


// Model name => collection
export default mongoose.model<
  ProductDocument,
  mongoose.PaginateModel<ProductDocument>
>('Product', Product, 'products');