import QuickReply from '@models/facebook/quickReplies.model';
import { IQuickReply } from '@models/facebook/quickReplies.model';

class QuickReplyRepo {
  async find(query: IQuickReply) {
    const quickReply = await QuickReply.findOne(query).lean();
    return quickReply;
  }

  async findMany(query: IQuickReply) {
    const quickReply = await QuickReply.find(query).lean();
    return quickReply;
  }
  
  async createQuickReply(entity: IQuickReply) {
    const quickReply = new QuickReply(entity)
    await quickReply.save();
    return quickReply;
  }

  async updateQuickReply(entity: IQuickReply) {
    const quickReply = await QuickReply.updateOne({ _id: entity._id }, entity);

    return quickReply;
  }

  async deleteQuickReply(query: IQuickReply) {
    return await QuickReply.deleteOne(query);
  }

  async findAndUpdate(entity: IQuickReply) {
    const filter = { _id: entity._id };
    const quickReply = await QuickReply.findOneAndUpdate(filter, entity);
    return quickReply;
  }

  async deleteMany(pageId?: string, ids?: string[]) {
    return await QuickReply.deleteMany({
      pageId: pageId,
      _id: {
        $in: ids
      }
    })
  }
}

const quickReplyRepo = new QuickReplyRepo();
export { quickReplyRepo };