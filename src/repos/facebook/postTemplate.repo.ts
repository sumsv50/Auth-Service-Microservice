/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import PostTemplate from "@models/facebook/postTemplate.model";
import { IPostTemplate } from "@models/facebook/postTemplate.model";

class PostTemplateRepo {
  async create(template: IPostTemplate) {
    return await PostTemplate.create(template);
  }
  async findAll(query: object, page: number, itemPerPage: number) {
    const templates = await PostTemplate.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      select: ['-createdBy']
    });
    return templates;
  }

  async findOne(query: IPostTemplate): Promise<IPostTemplate> {
    return await PostTemplate.findOne(query).select(['-createdBy']).lean();
  }

  async updateOne(query: IPostTemplate, data: IPostTemplate) {
    return await PostTemplate.updateOne(query, data);
  }

  async deleteOne(query: IPostTemplate) {
    return await PostTemplate.deleteOne(query);
  }

  async deleteMany(userId: string, templateIds: string[]) {
    return await PostTemplate.deleteMany({
      createdBy: userId,
      _id: {
        $in: templateIds
      }
    })
  }
}

const postTemplateRepo = new PostTemplateRepo();
export { postTemplateRepo };