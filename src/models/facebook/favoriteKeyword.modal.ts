import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IFavoriteKeyword {
  _id?: string,
  createdBy?: string,
  content?: string,
}

const FavoriteKeyword = new Schema({
  createdBy: Schema.Types.ObjectId,
  content: String,
}, { timestamps: true, id: true });

// Model name => collection
export default mongoose.model('FavoriteKeyword', FavoriteKeyword, 'favorite_keywords');