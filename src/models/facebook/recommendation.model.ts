import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IRecommendation {
  _id?: string,
  name?: string,
  text?: string,
  email?: string,
  pageId?: string, 
  mappings?: any,
  ids?: string[]
}

const Recommendation = new Schema({
  name: String,
  pageId: String,
  mappings: [
      {
        keys: [String],
        responseContent: String,
        active: Boolean
      }
  ]
}, { timestamps: true, id: true });

// Model name => collection
export default mongoose.model('Recommendation', Recommendation, 'recommendations');