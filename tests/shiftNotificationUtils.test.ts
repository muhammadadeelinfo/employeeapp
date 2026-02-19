import assert from 'assert';
import {
  SHIFT_END_KEYS,
  SHIFT_LOCATION_KEYS,
  SHIFT_START_KEYS,
  buildEventKey,
  buildShiftFilterValue,
  getShiftId,
  hasRowChange,
  readRowValue,
  shouldNotifyScheduleUpdate,
} from '../src/shared/utils/shiftNotificationUtils';

assert.ok(SHIFT_START_KEYS.includes('start'));
assert.ok(SHIFT_END_KEYS.includes('end'));
assert.ok(SHIFT_LOCATION_KEYS.includes('address'));

assert.strictEqual(readRowValue(undefined, ['a']), undefined);
assert.strictEqual(readRowValue({ a: '  ' }, ['a']), undefined);
assert.strictEqual(readRowValue({ a: 'value' }, ['a']), 'value');
assert.strictEqual(readRowValue({ a: 1 }, ['a']), '1');
assert.strictEqual(readRowValue({ a: false }, ['a']), 'false');

assert.strictEqual(hasRowChange({ a: 'x' }, { a: 'x' }, ['a']), false);
assert.strictEqual(hasRowChange({ a: 'x' }, { a: 'y' }, ['a']), true);

assert.strictEqual(getShiftId(undefined), undefined);
assert.strictEqual(getShiftId({ id: 's1' }), 's1');
assert.strictEqual(getShiftId({ shiftId: 's2' }), 's2');
assert.strictEqual(getShiftId({ shift_id: 's3' }), 's3');
assert.strictEqual(getShiftId({ assignmentId: 's4' }), 's4');
assert.strictEqual(getShiftId({ assignment_id: 's5' }), 's5');
assert.strictEqual(getShiftId({ id: '   ' }), undefined);

assert.strictEqual(
  buildEventKey('shift-1', {
    eventType: 'UPDATE',
    commit_timestamp: '2026-03-10T12:00:00Z',
  }),
  'shift-1:UPDATE:2026-03-10T12:00:00Z'
);
assert.strictEqual(
  buildEventKey('shift-1', {
    eventType: 'INSERT',
    new: { created_at: '2026-03-10T13:00:00Z' },
  }),
  'shift-1:INSERT:2026-03-10T13:00:00Z'
);

assert.strictEqual(
  shouldNotifyScheduleUpdate({
    eventType: 'INSERT',
    old: { start: '2026-03-10T08:00:00Z' },
    new: { start: '2026-03-10T10:00:00Z' },
  }),
  false
);
assert.strictEqual(
  shouldNotifyScheduleUpdate({
    eventType: 'UPDATE',
    old: { start: '2026-03-10T08:00:00Z' },
    new: { start: '2026-03-10T10:00:00Z' },
  }),
  true
);
assert.strictEqual(
  shouldNotifyScheduleUpdate({
    eventType: 'UPDATE',
    old: { end: '2026-03-10T12:00:00Z' },
    new: { end: '2026-03-10T12:00:00Z' },
  }),
  false
);
assert.strictEqual(
  shouldNotifyScheduleUpdate({
    eventType: 'UPDATE',
    old: { address: 'A' },
    new: { address: 'B' },
  }),
  true
);

assert.strictEqual(buildShiftFilterValue([]), '');
assert.strictEqual(buildShiftFilterValue(['a']), '"a"');
assert.strictEqual(buildShiftFilterValue(['a', 'a', 'b']), '"a","b"');
assert.strictEqual(buildShiftFilterValue(['a"b']), '"a\\"b"');

console.log('tests/shiftNotificationUtils.test.ts OK');
