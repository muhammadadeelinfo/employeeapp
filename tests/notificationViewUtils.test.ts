import assert from 'assert';
import {
  getRelativeTimeLabel,
  isMissingNotificationsTableError,
} from '../src/shared/utils/notificationViewUtils';

assert.strictEqual(isMissingNotificationsTableError(undefined), false);
assert.strictEqual(isMissingNotificationsTableError({}), false);
assert.strictEqual(isMissingNotificationsTableError({ code: 'PGRST205' }), true);
assert.strictEqual(
  isMissingNotificationsTableError({
    message: "Could not find the table 'public.notifications' in the schema cache",
  }),
  true
);
assert.strictEqual(
  isMissingNotificationsTableError({ code: '500', message: 'other error' }),
  false
);

const labels = { justNow: 'just now', comingSoon: 'coming soon' };
const now = Date.parse('2026-03-10T12:00:00Z');

assert.strictEqual(getRelativeTimeLabel('invalid', labels, now), 'just now');
assert.strictEqual(getRelativeTimeLabel('2026-03-10T12:00:20Z', labels, now), 'just now');
assert.strictEqual(getRelativeTimeLabel('2026-03-10T12:02:00Z', labels, now), 'coming soon');
assert.strictEqual(getRelativeTimeLabel('2026-03-10T11:45:00Z', labels, now), '15m ago');
assert.strictEqual(getRelativeTimeLabel('2026-03-10T09:00:00Z', labels, now), '3h ago');
assert.strictEqual(getRelativeTimeLabel('2026-03-08T12:00:00Z', labels, now), '2d ago');

console.log('tests/notificationViewUtils.test.ts OK');
