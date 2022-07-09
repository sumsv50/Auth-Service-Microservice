import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IUser {
  _id?: string,
  fbId?: string,
  ggId?: string,
  name?: string, 
  email?: string,
  password?: string, 
  isBlocked?: Boolean,
  picture?: string,
  fbAccessToken?: string,
  fbAccessToken_expire?: Number,
  pageAccessToken?: string,
}

const User = new Schema({
  fbId: String,
  ggId: String,
  name: String, 
  email: String,
  password: String, 
  isBlocked: {type: Boolean, default: false},
  picture: String,
  fbAccessToken: String,
  fbAccessToken_expire: Number,
  pageAccessToken: String,
}, { timestamps: true, id: true });

// Model name => collection
export default mongoose.model('User', User, 'users');