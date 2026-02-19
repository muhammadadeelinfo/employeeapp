import assert from 'assert';
import {
  getLanguageStorageKey,
  loadStoredLanguage,
  resolveStoredLanguage,
} from '../src/shared/utils/languageUtils';

const run = async () => {
  const storage = new Map<string, string>();

  const userAKey = getLanguageStorageKey('user-a');
  const userBKey = getLanguageStorageKey('user-b');

  assert.ok(userAKey);
  assert.ok(userBKey);
  assert.notStrictEqual(userAKey, userBKey);

  storage.set(userAKey!, 'de');
  storage.set(userBKey!, 'en');

  const readForUser = (userId: string | null) => {
    const key = getLanguageStorageKey(userId);
    if (!key) return 'en';
    return resolveStoredLanguage(storage.get(key) ?? null);
  };

  assert.strictEqual(readForUser('user-a'), 'de');
  assert.strictEqual(readForUser('user-b'), 'en');

  storage.set(userBKey!, 'fr');
  assert.strictEqual(readForUser('user-b'), 'en');

  assert.strictEqual(resolveStoredLanguage(null), 'en');
  assert.strictEqual(resolveStoredLanguage('de'), 'de');
  assert.strictEqual(resolveStoredLanguage('invalid-language' as never), 'en');

  const mockStorage = {
    getItem: async (key: string) => storage.get(key) ?? null,
  };

  assert.strictEqual(await loadStoredLanguage(mockStorage, userAKey), 'de');
  assert.strictEqual(await loadStoredLanguage(mockStorage, userBKey), 'en');
  assert.strictEqual(await loadStoredLanguage(mockStorage, null), 'en');
};

void run()
  .then(() => {
    console.log('tests/languagePersistence.test.ts OK');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
