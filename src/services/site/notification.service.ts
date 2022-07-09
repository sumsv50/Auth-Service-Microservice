import { NOTIFICATION_STATUS, NOTIFICATION_TYPE } from "@models/site/enum";
import { notificationRepo } from "@repos/site/notification.repo";

async function storeInterestingPostNotification (posts: any[], userId: string) {
  const notifications = posts.map(post => ({
    userId,
    type: NOTIFICATION_TYPE.INTERESTING_POST,
    data: post
  }))

  await notificationRepo.create(notifications);
}

async function getNotification (userId: string, status: string, page: number, itemPerPage: number) {
  const query = <any>{ userId };
  if (status == NOTIFICATION_STATUS.NOT_READ) {
    query.isRead = { "$ne": true }
  }
  const notifications = await notificationRepo.findAllPagination(query, page, itemPerPage);
  return notifications;
}

export default {
  storeInterestingPostNotification,
  getNotification
} as const;