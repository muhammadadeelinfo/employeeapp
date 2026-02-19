"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const notificationViewUtils_1 = require("../src/shared/utils/notificationViewUtils");
assert_1.default.strictEqual((0, notificationViewUtils_1.isMissingNotificationsTableError)(undefined), false);
assert_1.default.strictEqual((0, notificationViewUtils_1.isMissingNotificationsTableError)({}), false);
assert_1.default.strictEqual((0, notificationViewUtils_1.isMissingNotificationsTableError)({ code: 'PGRST205' }), true);
assert_1.default.strictEqual((0, notificationViewUtils_1.isMissingNotificationsTableError)({
    message: "Could not find the table 'public.notifications' in the schema cache",
}), true);
assert_1.default.strictEqual((0, notificationViewUtils_1.isMissingNotificationsTableError)({ code: '500', message: 'other error' }), false);
const labels = { justNow: 'just now', comingSoon: 'coming soon' };
const now = Date.parse('2026-03-10T12:00:00Z');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('invalid', labels, now), 'just now');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('2026-03-10T12:00:20Z', labels, now), 'just now');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('2026-03-10T12:02:00Z', labels, now), 'coming soon');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('2026-03-10T11:45:00Z', labels, now), '15m ago');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('2026-03-10T09:00:00Z', labels, now), '3h ago');
assert_1.default.strictEqual((0, notificationViewUtils_1.getRelativeTimeLabel)('2026-03-08T12:00:00Z', labels, now), '2d ago');
console.log('tests/notificationViewUtils.test.ts OK');
