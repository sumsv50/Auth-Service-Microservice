/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import FavoriteKeyword from "@models/facebook/favoriteKeyword.modal";
import { IFavoriteKeyword } from "@models/facebook/favoriteKeyword.modal";

export class FavoriteKeywordRepo {
  async create(keyword: IFavoriteKeyword) {
    return await FavoriteKeyword.create(keyword);
  }

  async findOne(query: IFavoriteKeyword) {
    const keyword = await FavoriteKeyword.findOne(query).lean();
    return keyword;
  }

  async findAll(query: object) {
    const keywords = await FavoriteKeyword.find(query).lean();
    return keywords;
  }

  async deleteOne(query: IFavoriteKeyword) {
    return await FavoriteKeyword.deleteOne(query);
  }

  async deleteMany(userId: string, keywordIds: string[]) {
    return await FavoriteKeyword.deleteMany({
      createdBy: userId,
      _id: {
        $in: keywordIds
      }
    })
  }
}

const favoriteKeywordRepo = new FavoriteKeywordRepo();
export { favoriteKeywordRepo };