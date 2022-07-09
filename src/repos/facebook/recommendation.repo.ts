import Recommendation from '@models/facebook/recommendation.model';
import { IRecommendation } from '@models/facebook/recommendation.model';

class RecommendationRepo {
  async find(query: IRecommendation) {
    const recommendation = await Recommendation.findOne(query).lean();
    return recommendation;
  }

  async findMany(query: IRecommendation) {
    const recommendation = await Recommendation.find(query).lean();
    return recommendation;
  }

  async createRecommendation(entity: IRecommendation) {
    const recommendation = new Recommendation(entity)
    await recommendation.save();
    return recommendation;
  }

  async updateRecommendation(entity: IRecommendation) {
    const recommendation = await Recommendation.updateOne({ _id: entity._id }, entity);

    return recommendation;
  }

  async findAndUpdate(entity: IRecommendation) {
    const filter = { pageId: entity.pageId };
    const recommendation = await Recommendation.findOneAndUpdate(filter, entity, { new: true , upsert: true });
    return recommendation;
  }

  async deleteMany(pageId?: string, ids?: string[]) {
    return await Recommendation.deleteMany({
      pageId: pageId,
      _id: {
        $in: ids
      }
    })
  }
}

const recommendationRepo = new RecommendationRepo();
export { recommendationRepo };