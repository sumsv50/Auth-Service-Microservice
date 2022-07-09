import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ITikiToken {
  _id?: string,
  userId: string,
  accessToken?: string,
  accessTokenExpire?: number,
  refreshToken?: string,
}

const TikiToken = new Schema({
  userId: { type: Schema.Types.ObjectId, index: true },
  accessToken: String,
  accessTokenExpire: Number,
  refreshToken: String,
}, { timestamps: true });

// Model name => collection
export default mongoose.model('TikiToken', TikiToken, 'tiki_tokens');