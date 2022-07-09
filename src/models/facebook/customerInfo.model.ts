import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ICustomerInfo {
  _id?: string;
  threadId?: string;
  senderId?: string;
  city?: string;
  district?: string;
  phoneNumber?: string;
  subDistrict?: string;
  detailAddress?: string;
  remark?: string;
  order?: string;
  label?: string;
  createdBy?: string;
}

const CustomerInfo = new Schema(
  {
    threadId: String,
    senderId: String,
    city: String,
    district: String,
    phoneNumber: String,
    subDistrict: String,
    detailAddress: String,
    remark: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    label: String,
    createdBy: Schema.Types.ObjectId,
  },
  {timestamps: true, id: true }
);

// Model name => collection
export default mongoose.model('CustomerInfo', CustomerInfo, 'customer_infos');
