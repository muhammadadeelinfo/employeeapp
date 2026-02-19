import assert from 'assert';
import { buildMapsSearchUrl } from '../src/shared/utils/mapUrl';

assert.strictEqual(buildMapsSearchUrl(undefined), undefined);
assert.strictEqual(buildMapsSearchUrl('   '), undefined);
assert.strictEqual(
  buildMapsSearchUrl('Public Library Berlin, Robert-Rossle-Strase 6'),
  'https://www.google.com/maps/search/?api=1&query=Public%20Library%20Berlin%2C%20Robert-Rossle-Strase%206'
);
assert.strictEqual(
  buildMapsSearchUrl('  10 Downing St, London  '),
  'https://www.google.com/maps/search/?api=1&query=10%20Downing%20St%2C%20London'
);

console.log('tests/maps.test.ts OK');
