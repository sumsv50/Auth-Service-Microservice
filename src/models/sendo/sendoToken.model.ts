import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ISendoToken {
  _id?: string,
  userId: string,
  shopName?: string,
  shopKey?: string,
  secretKey?: string,
  accessToken?: string,
  accessTokenExpire?: Date,
}

const SendoToken = new Schema({
  userId: { type: Schema.Types.ObjectId, index: true },
  shopName: String,
  shopKey: String,
  secretKey: String,
  accessToken: String,
  accessTokenExpire: Date,
}, { timestamps: true });

// Model name => collection
export default mongoose.model('SendoToken', SendoToken, 'sendo_tokens');