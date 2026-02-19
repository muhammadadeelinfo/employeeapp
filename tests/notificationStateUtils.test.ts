import assert from 'assert';
import {
  countUnreadNotifications,
  getUnreadNotificationIds,
  markAllNotificationsReadInList,
  markNotificationReadInList,
} from '../src/shared/utils/notificationStateUtils';
import type { NotificationRecord } from '../src/shared/utils/notificationUtils';

const notifications: NotificationRecord[] = [
  {
    id: 'n-1',
    title: 'One',
    detail: 'first',
    createdAt: '2026-03-10T10:00:00Z',
    read: false,
    category: 'general',
  },
  {
    id: 'n-2',
    title: 'Two',
    detail: 'second',
    createdAt: '2026-03-10T11:00:00Z',
    read: true,
    category: 'admin',
  },
  {
    id: 'n-3',
    title: 'Three',
    detail: 'third',
    createdAt: '2026-03-10T12:00:00Z',
    read: false,
    category: 'shift-schedule',
  },
];

assert.strictEqual(countUnreadNotifications(notifications), 2);
assert.deepStrictEqual(getUnreadNotificationIds(notifications), ['n-1', 'n-3']);

const markedSingle = markNotificationReadInList(notifications, 'n-1');
assert.strictEqual(markedSingle[0].read, true);
assert.strictEqual(markedSingle[1].read, true);
assert.strictEqual(markedSingle[2].read, false);
assert.strictEqual(notifications[0].read, false, 'original array should remain unchanged');

const markedMissing = markNotificationReadInList(notifications, 'does-not-exist');
assert.deepStrictEqual(markedMissing, notifications);

const markedAll = markAllNotificationsReadInList(notifications);
assert.strictEqual(markedAll.every((item) => item.read), true);
assert.strictEqual(notifications.some((item) => !item.read), true, 'original input should not mutate');

console.log('tests/notificationStateUtils.test.ts OK');
