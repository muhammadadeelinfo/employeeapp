import assert from 'assert';
import {
  getShiftConfirmationStatusLabel,
  normalizeShiftConfirmationStatus,
} from '../src/lib/shiftConfirmationStatus';

assert.strictEqual(normalizeShiftConfirmationStatus(undefined), 'not published');
assert.strictEqual(normalizeShiftConfirmationStatus(''), 'not published');
assert.strictEqual(normalizeShiftConfirmationStatus('pending'), 'pending');
assert.strictEqual(normalizeShiftConfirmationStatus('Scheduled'), 'scheduled');
assert.strictEqual(normalizeShiftConfirmationStatus('confirmed_by_employee'), 'confirmed by employee');
assert.strictEqual(normalizeShiftConfirmationStatus('confirmed-by-employee'), 'confirmed by employee');
assert.strictEqual(normalizeShiftConfirmationStatus('  confirmed by employee  '), 'confirmed by employee');
assert.strictEqual(normalizeShiftConfirmationStatus('unknown status'), 'not published');

assert.strictEqual(getShiftConfirmationStatusLabel('not published'), 'Not published');
assert.strictEqual(getShiftConfirmationStatusLabel('pending'), 'Pending');
assert.strictEqual(getShiftConfirmationStatusLabel('scheduled'), 'Scheduled');
assert.strictEqual(getShiftConfirmationStatusLabel('assigned'), 'Assigned');
assert.strictEqual(getShiftConfirmationStatusLabel('published'), 'Published');
assert.strictEqual(getShiftConfirmationStatusLabel('confirmed'), 'Confirmed');
assert.strictEqual(
  getShiftConfirmationStatusLabel('confirmed by employee'),
  'Confirmed by employee'
);

console.log('tests/shiftConfirmationStatus.test.ts OK');
