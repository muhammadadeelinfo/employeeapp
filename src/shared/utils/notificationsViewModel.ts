export const getNotificationsSummaryTranslationKey = (unreadCount: number) =>
  unreadCount > 0 ? 'notificationsPanelWaiting' : 'notificationsPanelAllCaughtUp';
