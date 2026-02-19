"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationStateUtils_1 = require("../src/shared/utils/notificationStateUtils");
const notifications = [
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
assert_1.default.strictEqual((0, notificationStateUtils_1.countUnreadNotifications)(notifications), 2);
assert_1.default.deepStrictEqual((0, notificationStateUtils_1.getUnreadNotificationIds)(notifications), ['n-1', 'n-3']);
const markedSingle = (0, notificationStateUtils_1.markNotificationReadInList)(notifications, 'n-1');
assert_1.default.strictEqual(markedSingle[0].read, true);
assert_1.default.strictEqual(markedSingle[1].read, true);
assert_1.default.strictEqual(markedSingle[2].read, false);
assert_1.default.strictEqual(notifications[0].read, false, 'original array should remain unchanged');
const markedMissing = (0, notificationStateUtils_1.markNotificationReadInList)(notifications, 'does-not-exist');
assert_1.default.deepStrictEqual(markedMissing, notifications);
const markedAll = (0, notificationStateUtils_1.markAllNotificationsReadInList)(notifications);
assert_1.default.strictEqual(markedAll.every((item) => item.read), true);
assert_1.default.strictEqual(notifications.some((item) => !item.read), true, 'original input should not mutate');
console.log('tests/notificationStateUtils.test.ts OK');
