import TemplateComment from '@models/site/templateComment.model';
import { ITemplateComment } from '@models/site/templateComment.model';

export class TemplateCommentRepo {
  async create(comment: ITemplateComment) {
    return await TemplateComment.create(comment);
  }

  async updateOne(query: object, data: ITemplateComment) {
    return await TemplateComment.updateOne(query, data);
  }

  async findOne(query: ITemplateComment) {
    return TemplateComment.findOne(query)
      .select(['-createdBy'])
      .lean();
  }
  
  async findAll(query: object) {
    return await TemplateComment.find(query)
      .select(['-createdBy'])
      .lean();
  }

  async deleteOne(query: ITemplateComment) {
    return await TemplateComment.deleteOne(query);
  }
}