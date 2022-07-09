import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;


export interface ITikiProduct {
    _id?: string;
    category_id?: number;
    category_name?: string;
    name?: string;
    sku?: string;
    description?: string;
    market_price?: number;
    attributes?: Array<any>;
    image?: string;
    images?: Array<string>;
    option_attributes?: Array<string>;
    variants?: Array<any>;
    certificate_files?: Array<any>;

    track_id?: string;
    request_id?: string;
    state?: string;
    state_description?: string;
    reason?: string;

    createdBy?: String
}

const TikiProduct = new Schema ({

    category_id: Number,
    category_name: String,
    name: String,
    sku: String,
    description: String,
    market_price: Number,
    attributes: Array,
    image: String,
    images: Array,
    option_attributes: Array,
    variants: Array,
    certificate_files: Array,

    track_id: String,
    request_id: String,
    state: String,
    state_description: String,
    reason: String,

    createdBy: Schema.Types.ObjectId,

}, { timestamps: true, id: true });

// Model name => collection
TikiProduct.plugin(paginate);

interface TikiProductDocument extends Document, mongoose.Document { }


// Model name => collection
export default mongoose.model<
  TikiProductDocument,
  mongoose.PaginateModel<TikiProductDocument>
>('TikiProduct', TikiProduct, 'tiki_products');