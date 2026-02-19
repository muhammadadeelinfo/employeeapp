"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const shiftNotificationUtils_1 = require("../src/shared/utils/shiftNotificationUtils");
assert_1.default.ok(shiftNotificationUtils_1.SHIFT_START_KEYS.includes('start'));
assert_1.default.ok(shiftNotificationUtils_1.SHIFT_END_KEYS.includes('end'));
assert_1.default.ok(shiftNotificationUtils_1.SHIFT_LOCATION_KEYS.includes('address'));
assert_1.default.strictEqual((0, shiftNotificationUtils_1.readRowValue)(undefined, ['a']), undefined);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.readRowValue)({ a: '  ' }, ['a']), undefined);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.readRowValue)({ a: 'value' }, ['a']), 'value');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.readRowValue)({ a: 1 }, ['a']), '1');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.readRowValue)({ a: false }, ['a']), 'false');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.hasRowChange)({ a: 'x' }, { a: 'x' }, ['a']), false);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.hasRowChange)({ a: 'x' }, { a: 'y' }, ['a']), true);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)(undefined), undefined);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ id: 's1' }), 's1');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ shiftId: 's2' }), 's2');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ shift_id: 's3' }), 's3');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ assignmentId: 's4' }), 's4');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ assignment_id: 's5' }), 's5');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.getShiftId)({ id: '   ' }), undefined);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildEventKey)('shift-1', {
    eventType: 'UPDATE',
    commit_timestamp: '2026-03-10T12:00:00Z',
}), 'shift-1:UPDATE:2026-03-10T12:00:00Z');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildEventKey)('shift-1', {
    eventType: 'INSERT',
    new: { created_at: '2026-03-10T13:00:00Z' },
}), 'shift-1:INSERT:2026-03-10T13:00:00Z');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.shouldNotifyScheduleUpdate)({
    eventType: 'INSERT',
    old: { start: '2026-03-10T08:00:00Z' },
    new: { start: '2026-03-10T10:00:00Z' },
}), false);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.shouldNotifyScheduleUpdate)({
    eventType: 'UPDATE',
    old: { start: '2026-03-10T08:00:00Z' },
    new: { start: '2026-03-10T10:00:00Z' },
}), true);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.shouldNotifyScheduleUpdate)({
    eventType: 'UPDATE',
    old: { end: '2026-03-10T12:00:00Z' },
    new: { end: '2026-03-10T12:00:00Z' },
}), false);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.shouldNotifyScheduleUpdate)({
    eventType: 'UPDATE',
    old: { address: 'A' },
    new: { address: 'B' },
}), true);
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildShiftFilterValue)([]), '');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildShiftFilterValue)(['a']), '"a"');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildShiftFilterValue)(['a', 'a', 'b']), '"a","b"');
assert_1.default.strictEqual((0, shiftNotificationUtils_1.buildShiftFilterValue)(['a"b']), '"a\\"b"');
console.log('tests/shiftNotificationUtils.test.ts OK');
