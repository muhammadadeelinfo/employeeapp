"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationUtils_1 = require("../src/shared/utils/notificationUtils");
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)('Shift published', 'New shift assigned'), 'shift-published');
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)('Shift removed', 'This shift was canceled'), 'shift-removed');
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)('Schedule changed', 'Your schedule was updated'), 'shift-schedule');
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)('Admin notice', 'Policy message'), 'admin');
assert_1.default.strictEqual((0, notificationUtils_1.determineNotificationCategory)('FYI', 'General information'), 'general');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ target: '/calendar' }), '/calendar');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ deepLink: '  /notifications  ' }), '/notifications');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ url: '/help-center', shiftId: 'abc123' }), '/help-center');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ deepLink: '/%2528tabs%2529/account' }), '/account');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ deepLink: '/(tabs)/notifications' }), '/notifications');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ deepLink: 'exp://127.0.0.1:8081/--/%2528tabs%2529/account' }), '/account');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)({ shiftId: 'abc123' }), '/shift-details/abc123');
assert_1.default.strictEqual((0, notificationUtils_1.resolveTargetPath)(undefined), undefined);
assert_1.default.strictEqual((0, notificationUtils_1.parseIsoDate)('2026-03-10T10:00:00Z'), '2026-03-10T10:00:00Z');
assert_1.default.strictEqual((0, notificationUtils_1.parseIsoDate)(new Date('2026-03-10T10:00:00Z')), '2026-03-10T10:00:00.000Z');
assert_1.default.strictEqual((0, notificationUtils_1.parseIsoDate)(1_770_000_000_000), '2026-02-02T02:40:00.000Z');
const normalized = (0, notificationUtils_1.normalizeNotificationRow)({
    id: 42,
    message: 'Shift schedule updated',
    body: 'Starts at 8:00',
    is_read: false,
    created_at: 1_770_000_000_000,
    metadata: { shift_id: 'shift-42' },
}, { title: 'Fallback title', detail: 'Fallback detail' });
assert_1.default.ok(normalized, 'row should normalize');
assert_1.default.strictEqual(normalized?.id, '42');
assert_1.default.strictEqual(normalized?.title, 'Shift schedule updated');
assert_1.default.strictEqual(normalized?.detail, 'Starts at 8:00');
assert_1.default.strictEqual(normalized?.read, false);
assert_1.default.strictEqual(normalized?.targetPath, '/shift-details/shift-42');
assert_1.default.strictEqual(normalized?.category, 'shift-schedule');
const normalizedWithFallbacks = (0, notificationUtils_1.normalizeNotificationRow)({
    notification_id: 'abc',
    description: 'Fallback detail from description',
    status: 'read',
    timestamp: '2026-03-10T12:00:00Z',
    payload: { deepLink: '/calendar-day/2026-03-10' },
}, { title: 'Fallback title', detail: 'Fallback detail' });
assert_1.default.ok(normalizedWithFallbacks, 'row with fallback fields should normalize');
assert_1.default.strictEqual(normalizedWithFallbacks?.id, 'abc');
assert_1.default.strictEqual(normalizedWithFallbacks?.title, 'Fallback title');
assert_1.default.strictEqual(normalizedWithFallbacks?.detail, 'Fallback detail from description');
assert_1.default.strictEqual(normalizedWithFallbacks?.read, true);
assert_1.default.strictEqual(normalizedWithFallbacks?.targetPath, '/calendar-day/2026-03-10');
assert_1.default.strictEqual(normalizedWithFallbacks?.category, 'general');
const invalidRow = (0, notificationUtils_1.normalizeNotificationRow)({ title: 'Missing id notification' }, { title: 'Fallback title', detail: 'Fallback detail' });
assert_1.default.strictEqual(invalidRow, null);
const normalizedWithBlankTitle = (0, notificationUtils_1.normalizeNotificationRow)({
    id: 'blank-title',
    title: '   ',
    body: 'Body detail',
    read: true,
    createdAt: '2026-03-10T13:00:00Z',
}, { title: 'Fallback title', detail: 'Fallback detail' });
assert_1.default.ok(normalizedWithBlankTitle, 'blank title should fall back');
assert_1.default.strictEqual(normalizedWithBlankTitle?.title, 'Fallback title');
assert_1.default.strictEqual(normalizedWithBlankTitle?.detail, 'Body detail');
assert_1.default.strictEqual(normalizedWithBlankTitle?.read, true);
const now = new Date('2026-03-10T12:00:00Z');
const notifications = [
    {
        id: 'today-1',
        title: 'Today',
        detail: 'today item',
        createdAt: '2026-03-10T11:00:00Z',
        read: false,
        category: 'general',
    },
    {
        id: 'yesterday-1',
        title: 'Yesterday',
        detail: 'yesterday item',
        createdAt: '2026-03-09T10:00:00Z',
        read: false,
        category: 'general',
    },
    {
        id: 'earlier-1',
        title: 'Earlier',
        detail: 'earlier item',
        createdAt: '2026-03-01T10:00:00Z',
        read: true,
        category: 'general',
    },
];
const grouped = (0, notificationUtils_1.groupNotificationsByRecency)(notifications, {
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier',
}, now);
assert_1.default.strictEqual(grouped.length, 3);
assert_1.default.strictEqual(grouped[0].key, 'today');
assert_1.default.strictEqual(grouped[0].items.length, 1);
assert_1.default.strictEqual(grouped[1].key, 'yesterday');
assert_1.default.strictEqual(grouped[1].items.length, 1);
assert_1.default.strictEqual(grouped[2].key, 'earlier');
assert_1.default.strictEqual(grouped[2].items.length, 1);
const groupedWithoutEarlier = (0, notificationUtils_1.groupNotificationsByRecency)(notifications.slice(0, 2), {
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier',
}, now);
assert_1.default.strictEqual(groupedWithoutEarlier.length, 2);
assert_1.default.strictEqual(groupedWithoutEarlier[0].key, 'today');
assert_1.default.strictEqual(groupedWithoutEarlier[1].key, 'yesterday');
console.log('tests/notificationUtils.test.ts OK');
