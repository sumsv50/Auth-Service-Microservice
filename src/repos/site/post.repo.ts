/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import FbPost from "@models/site/post.model";
import { IFbPost } from "@models/site/post.model";

export class FbPostRepo {
  async create(post: IFbPost) {
    return await FbPost.create(post);
  }
  async findAll(query: object, page: number, itemPerPage: number) {
    const templates = await FbPost.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      select: ['-createdBy'],
      populate: 'product'
    });
    return templates;
  }

  async findOne(query: IFbPost): Promise<IFbPost> {
    return await FbPost.findOne(query).select(['-createdBy']).populate('product').lean();
  }

  async find(query: any): Promise<any> {
    return await FbPost.find(query).select(['-createdBy']).lean();
  }

  async updateOne(query: IFbPost, data: IFbPost) {
    return await FbPost.updateOne(query, data);
  }

  async deleteOne(query: IFbPost) {
    return await FbPost.deleteOne(query);
  }

  async deleteMany(userId: string, templateIds: string[]) {
    return await FbPost.deleteMany({
      createdBy: userId,
      _id: {
        $in: templateIds
      }
    })
  }

  async findManyWithoutPaginate(query: object): Promise<Array<any>> {
    return await FbPost.find(query);
  }

  async findAndFilter(query: object, fields : string) : Promise<Array<any>> {
    return await FbPost.find(query,fields).lean();
  }

  async count(query: object): Promise<number> {
    return await FbPost.count(query);
  }

  async aggregate(query: any): Promise<Array<any>> {
    return await FbPost.aggregate(query);
  }
}