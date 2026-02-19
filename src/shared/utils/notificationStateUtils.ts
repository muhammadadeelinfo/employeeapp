import type { NotificationRecord } from './notificationUtils';

export const markNotificationReadInList = (
  notifications: NotificationRecord[],
  notificationId: string
): NotificationRecord[] =>
  notifications.map((item) => (item.id === notificationId ? { ...item, read: true } : item));

export const markAllNotificationsReadInList = (
  notifications: NotificationRecord[]
): NotificationRecord[] => notifications.map((item) => ({ ...item, read: true }));

export const getUnreadNotificationIds = (notifications: NotificationRecord[]): string[] =>
  notifications.filter((item) => !item.read).map((item) => item.id);

export const countUnreadNotifications = (notifications: NotificationRecord[]): number =>
  notifications.filter((item) => !item.read).length;
