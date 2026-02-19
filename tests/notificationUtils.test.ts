import assert from 'assert';
import {
  determineNotificationCategory,
  groupNotificationsByRecency,
  normalizeNotificationRow,
  resolveTargetPath,
  type NotificationRecord,
} from '../src/shared/utils/notificationUtils';

assert.strictEqual(
  determineNotificationCategory('Shift published', 'New shift assigned'),
  'shift-published'
);
assert.strictEqual(
  determineNotificationCategory('Shift removed', 'This shift was canceled'),
  'shift-removed'
);
assert.strictEqual(
  determineNotificationCategory('Schedule changed', 'Your schedule was updated'),
  'shift-schedule'
);
assert.strictEqual(
  determineNotificationCategory('Admin notice', 'Policy message'),
  'admin'
);
assert.strictEqual(
  determineNotificationCategory('FYI', 'General information'),
  'general'
);

assert.strictEqual(resolveTargetPath({ target: '/calendar' }), '/calendar');
assert.strictEqual(resolveTargetPath({ shiftId: 'abc123' }), '/shift-details/abc123');
assert.strictEqual(resolveTargetPath(undefined), undefined);

const normalized = normalizeNotificationRow(
  {
    id: 42,
    message: 'Shift schedule updated',
    body: 'Starts at 8:00',
    is_read: false,
    created_at: 1_770_000_000_000,
    metadata: { shift_id: 'shift-42' },
  },
  { title: 'Fallback title', detail: 'Fallback detail' }
);

assert.ok(normalized, 'row should normalize');
assert.strictEqual(normalized?.id, '42');
assert.strictEqual(normalized?.title, 'Shift schedule updated');
assert.strictEqual(normalized?.detail, 'Starts at 8:00');
assert.strictEqual(normalized?.read, false);
assert.strictEqual(normalized?.targetPath, '/shift-details/shift-42');
assert.strictEqual(normalized?.category, 'shift-schedule');

const now = new Date('2026-03-10T12:00:00Z');
const notifications: NotificationRecord[] = [
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

const grouped = groupNotificationsByRecency(
  notifications,
  {
    today: 'Today',
    yesterday: 'Yesterday',
    earlier: 'Earlier',
  },
  now
);

assert.strictEqual(grouped.length, 3);
assert.strictEqual(grouped[0].key, 'today');
assert.strictEqual(grouped[0].items.length, 1);
assert.strictEqual(grouped[1].key, 'yesterday');
assert.strictEqual(grouped[1].items.length, 1);
assert.strictEqual(grouped[2].key, 'earlier');
assert.strictEqual(grouped[2].items.length, 1);

console.log('tests/notificationUtils.test.ts OK');
