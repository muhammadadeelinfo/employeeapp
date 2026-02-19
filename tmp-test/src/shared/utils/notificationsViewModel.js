"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsSummaryTranslationKey = void 0;
const getNotificationsSummaryTranslationKey = (unreadCount) => unreadCount > 0 ? 'notificationsPanelWaiting' : 'notificationsPanelAllCaughtUp';
exports.getNotificationsSummaryTranslationKey = getNotificationsSummaryTranslationKey;
