import Notification from '../../database/models/Notification';

export async function list(
  userId: string,
  unreadOnly?: boolean,
  page: number = 1,
  limit: number = 20,
) {
  const where: Record<string, unknown> = { userId };
  if (unreadOnly) {
    where.isRead = false;
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Notification.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    notifications: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new Error('Notification not found');
  if (notification.userId !== userId) throw new Error('Unauthorized');

  await notification.update({ isRead: true });
  return notification;
}

export async function markAllRead(userId: string) {
  await Notification.update({ isRead: true }, { where: { userId } });
}
