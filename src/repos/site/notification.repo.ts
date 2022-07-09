import Notification from '@models/site/notification';
import { INotification } from '@models/site/notification'

class NotificationRepo {
  async create(orders: INotification[]) {
    return await Notification.create(orders);
  }

  async findAllPagination(query: object, page: number, itemPerPage: number) {
    const notifications = await Notification.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      sort: '-createdAt'
    })
    return notifications;
  }

  async findOne(query: object) {
    const notification = await Notification.findOne(query);
    return notification;
  }

  async updateOne(query: INotification, data: INotification) {
    return await Notification.updateOne(query, data);
  }

  async updateMany(query: INotification, data: INotification) {
    return await Notification.updateMany(query, data);
  }
}

const notificationRepo = new NotificationRepo();
export { notificationRepo };