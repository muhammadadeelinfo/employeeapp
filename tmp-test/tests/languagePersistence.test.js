"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const languageUtils_1 = require("../src/shared/utils/languageUtils");
const run = async () => {
    const storage = new Map();
    const userAKey = (0, languageUtils_1.getLanguageStorageKey)('user-a');
    const userBKey = (0, languageUtils_1.getLanguageStorageKey)('user-b');
    assert_1.default.ok(userAKey);
    assert_1.default.ok(userBKey);
    assert_1.default.notStrictEqual(userAKey, userBKey);
    storage.set(userAKey, 'de');
    storage.set(userBKey, 'en');
    const readForUser = (userId) => {
        const key = (0, languageUtils_1.getLanguageStorageKey)(userId);
        if (!key)
            return 'en';
        return (0, languageUtils_1.resolveStoredLanguage)(storage.get(key) ?? null);
    };
    assert_1.default.strictEqual(readForUser('user-a'), 'de');
    assert_1.default.strictEqual(readForUser('user-b'), 'en');
    storage.set(userBKey, 'fr');
    assert_1.default.strictEqual(readForUser('user-b'), 'en');
    assert_1.default.strictEqual((0, languageUtils_1.resolveStoredLanguage)(null), 'en');
    assert_1.default.strictEqual((0, languageUtils_1.resolveStoredLanguage)('de'), 'de');
    assert_1.default.strictEqual((0, languageUtils_1.resolveStoredLanguage)('invalid-language'), 'en');
    const mockStorage = {
        getItem: async (key) => storage.get(key) ?? null,
    };
    assert_1.default.strictEqual(await (0, languageUtils_1.loadStoredLanguage)(mockStorage, userAKey), 'de');
    assert_1.default.strictEqual(await (0, languageUtils_1.loadStoredLanguage)(mockStorage, userBKey), 'en');
    assert_1.default.strictEqual(await (0, languageUtils_1.loadStoredLanguage)(mockStorage, null), 'en');
};
void run()
    .then(() => {
    console.log('tests/languagePersistence.test.ts OK');
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
