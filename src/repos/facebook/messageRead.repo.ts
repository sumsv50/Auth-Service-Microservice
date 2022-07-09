import MessageRead from '@models/facebook/messageRead.model';
import { IMessageRead } from '@models/facebook/messageRead.model';

class MessageReadRepo {
    async find(query: IMessageRead) {
      const messageRead = await MessageRead.findOne(query).lean();
      return messageRead;
    }

    async createMessageRead(entity: IMessageRead) {
      const messageRead = new MessageRead(entity)
      await messageRead.save();
    }
  
    async updateMessageRead(entity: IMessageRead) {
      const messageRead = await MessageRead.updateOne({ _id: entity._id }, entity);
  
      return messageRead;
    }
  
    async findAndUpdate(entity: IMessageRead) {
      const filter = { threadId: entity.threadId, userId: entity.userId };
      const messageRead = await MessageRead.findOneAndUpdate(filter, entity, { new: true , upsert: true });
      return messageRead;
    }
  }

const messageReadRepo = new MessageReadRepo();
export { messageReadRepo };